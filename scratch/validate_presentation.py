import json
import os
import re

def validate():
    base_dir = "/Users/hakankarlsson/Library/CloudStorage/GoogleDrive-hlg.karlsson@gmail.com/Min enhet/🌎GAIA/Deployments/ai-for-ledare"
    slides_path = os.path.join(base_dir, "slides.json")
    
    if not os.path.exists(slides_path):
        print(f"ERROR: slides.json not found at {slides_path}")
        return

    try:
        with open(slides_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"ERROR: slides.json is not valid JSON: {e}")
        return
    except Exception as e:
        print(f"ERROR reading slides.json: {e}")
        return

    if not isinstance(data, dict):
        print("ERROR: slides.json top-level is not an object/dictionary")
        return

    sections = data.get("sections", [])
    slides = data.get("slides", [])

    print(f"Loaded config: project={data.get('meta', {}).get('project')}")
    print(f"Sections defined: {[s.get('id') for s in sections]}")
    print(f"Successfully loaded {len(slides)} slides from slides.json.")

    errors = 0
    warnings = 0

    section_ids = {s.get("id") for s in sections}

    # Let's inspect slide types and referenced files
    for idx, slide in enumerate(slides):
        if not isinstance(slide, dict):
            print(f"ERROR: Slide at index {idx} is not an object: {slide}")
            errors += 1
            continue

        slide_id = slide.get("id", f"index_{idx}")
        slide_type = slide.get("type", "unknown")
        slide_section = slide.get("section")

        if slide_section and slide_section not in section_ids:
            print(f"WARNING: Slide [{slide_id}] uses undefined section: {slide_section}")
            warnings += 1
        
        # Verify assets/ paths
        # Search all string values recursively for any local file paths starting with "assets/"
        def check_assets(obj, path_prefix=""):
            nonlocal errors, warnings
            if isinstance(obj, str):
                # Look for "assets/..."
                matches = re.findall(r'assets/[\w\.\-\/]+', obj)
                for match in matches:
                    # check if the file exists
                    full_asset_path = os.path.join(base_dir, match)
                    if not os.path.exists(full_asset_path):
                        print(f"ERROR: Slide [{slide_id}] references missing asset: {match} (resolved to {full_asset_path})")
                        errors += 1
                    else:
                        pass
            elif isinstance(obj, dict):
                for k, v in obj.items():
                    check_assets(v, f"{path_prefix}.{k}")
            elif isinstance(obj, list):
                for i, v in enumerate(obj):
                    check_assets(v, f"{path_prefix}[{i}]")

        check_assets(slide)

    # Check that key files exist
    required_files = [
        "index.html",
        "audience.html",
        "modules/component-forge.js"
    ]
    for req_file in required_files:
        full_path = os.path.join(base_dir, req_file)
        if not os.path.exists(full_path):
            print(f"ERROR: Required file {req_file} is missing from {full_path}")
            errors += 1
        else:
            print(f"OK: {req_file} exists.")

    print(f"\nValidation complete. Errors: {errors}, Warnings: {warnings}")

if __name__ == "__main__":
    validate()

