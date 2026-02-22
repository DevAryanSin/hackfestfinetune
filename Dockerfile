FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8080 \
    WEB_CONCURRENCY=1

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

COPY . .

# Install dependencies from whichever context was used:
# 1) repo root build context with Dockerfile at HackfestFinetuners/Dockerfile
# 2) build context already set to HackfestFinetuners/
RUN python -m pip install --upgrade pip \
    && if [ -f /app/requirements.txt ]; then \
        python -m pip install -r /app/requirements.txt; \
    elif [ -f /app/HackfestFinetuners/requirements.txt ]; then \
        python -m pip install -r /app/HackfestFinetuners/requirements.txt; \
    else \
        echo "requirements.txt not found in expected locations" && exit 1; \
    fi

# Ensure package dirs are explicit Python packages (both context layouts).
RUN if [ -d /app/brd_module ]; then \
      touch /app/brd_module/__init__.py /app/integration_module/__init__.py /app/noise_filter_module/__init__.py; \
    fi \
    && if [ -d /app/HackfestFinetuners/brd_module ]; then \
      touch /app/HackfestFinetuners/brd_module/__init__.py /app/HackfestFinetuners/integration_module/__init__.py /app/HackfestFinetuners/noise_filter_module/__init__.py; \
    fi

# Least privilege runtime user
RUN useradd -m -u 10001 appuser && chown -R appuser:appuser /app
USER appuser

# Cloud Run listens on $PORT; we expose 8080 as the canonical container port.
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -fsS "http://127.0.0.1:${PORT:-8080}/" || exit 1

CMD ["sh", "-c", "if [ -d /app/HackfestFinetuners/api ]; then cd /app/HackfestFinetuners; fi; exec gunicorn api.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8080} --workers ${WEB_CONCURRENCY:-1} --threads 2 --timeout 0 --graceful-timeout 30 --access-logfile - --error-logfile -"]
