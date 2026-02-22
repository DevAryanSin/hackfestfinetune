FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /build

# Build deps required for wheels (psycopg2, some native libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libpq-dev \
    libffi-dev \
    libxml2-dev \
    libxslt1-dev \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-docker.txt .
RUN python -m pip install --upgrade pip setuptools wheel \
    && python -m pip wheel --wheel-dir /wheels -r requirements-docker.txt


FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8080 \
    WEB_CONCURRENCY=2

WORKDIR /app

# Runtime system libs for psycopg2 + weasyprint + pymupdf/docx rendering stack
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libffi8 \
    libxml2 \
    libxslt1.1 \
    libjpeg62-turbo \
    zlib1g \
    shared-mime-info \
    fonts-dejavu-core \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-docker.txt .
COPY --from=builder /wheels /wheels
RUN python -m pip install --upgrade pip \
    && python -m pip install --no-index --find-links=/wheels -r requirements-docker.txt \
    && rm -rf /wheels

COPY . .

# Ensure package dirs are explicit Python packages
RUN touch brd_module/__init__.py integration_module/__init__.py noise_filter_module/__init__.py

# Least privilege runtime user
RUN useradd -m -u 10001 appuser && chown -R appuser:appuser /app
USER appuser

# Cloud Run listens on $PORT; we expose 8080 as the canonical container port.
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -fsS "http://127.0.0.1:${PORT:-8080}/" || exit 1

CMD ["sh", "-c", "exec gunicorn api.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8080} --workers ${WEB_CONCURRENCY:-2} --threads 2 --timeout 0 --graceful-timeout 30 --access-logfile - --error-logfile -"]
