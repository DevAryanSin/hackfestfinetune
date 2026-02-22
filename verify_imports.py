import sys
import os

# Add the project root to sys.path
sys.path.append(os.getcwd())

print("Testing integration_module imports...")
try:
    from integration_module.routes import gmail_routes, slack_routes, pdf_routes
    from integration_module import gmail, pdf, slack_auth
    print("✓ integration_module imports successful!")
except Exception as e:
    print(f"✗ integration_module import failed: {e}")
    sys.exit(1)

print("\nTesting noise_filter_module imports...")
try:
    from noise_filter_module import main as nf_main
    from noise_filter_module import classifier, storage, schema, enron_parser
    print("✓ noise_filter_module imports successful!")
except Exception as e:
    print(f"✗ noise_filter_module import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\nAll imports verified successfully!")
