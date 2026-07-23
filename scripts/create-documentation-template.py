
#!/usr/bin/env python3
import os
import zipfile
import pathlib

def create_documentation_structure():
    """Create a comprehensive documentation structure template"""
    
    base = "docs/templates"
    os.makedirs(base, exist_ok=True)

    # Create template folders aligned with your existing structure
    folders = [
        "docs",
        "docs/internal",
        "docs/internal/technical", 
        "docs/internal/business",
        "docs/internal/security",
        "docs/public",
        "docs/public/api",
        "docs/public/tutorials",
        "docs/public/user-guide",
        "docs/modules",
        "docs/systems",
        "docs/components",
        "docs/utilities"
    ]

    for f in folders:
        os.makedirs(os.path.join(base, f), exist_ok=True)

    # Enhanced template content
    technical_template = """# TECHNICAL DOCUMENTATION TEMPLATE

## Overview
Brief description of the technical component/system.

## Architecture
- Component structure
- Dependencies
- Integration points

## Implementation Details
```typescript
// Code examples
```

## API Reference
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| | | | |

## Performance Metrics
- Benchmarks
- Optimization notes
- Resource requirements

## Testing
- Unit tests
- Integration tests
- Performance tests

---
**Classification**: Internal/Technical  
**Last Updated**: {date}  
**Author**: UUON Foundation
"""

    public_template = """# PUBLIC DOCUMENTATION TEMPLATE

## Introduction
User-friendly overview of the feature/component.

## Getting Started
Step-by-step guide for users.

## Examples
```javascript
// Practical code examples
```

## FAQ
**Q: Common question?**  
A: Clear answer.

## Support
Contact: support@uuonfoundation.com

---
**Classification**: Public  
**Last Updated**: {date}  
**Author**: UUON Foundation
"""

    # Create template files
    files = {
        "docs/README.md": """# Documentation Templates

This directory contains standardized templates for Δmension Mathematical Universe documentation.

## Structure
- `internal/` - Technical, business, and security documentation
- `public/` - User-facing guides and API documentation  
- `modules/` - Individual module documentation
- `systems/` - System architecture documentation
- `components/` - Component-level documentation
- `utilities/` - Utility function documentation

## Usage
Copy the appropriate template and customize for your needs.
""",
        "docs/internal/technical/technical_template.md": technical_template,
        "docs/public/api/api_template.md": public_template,
        "docs/modules/module_template.md": technical_template,
        "docs/systems/system_template.md": technical_template,
        "docs/components/component_template.md": technical_template,
        "docs/utilities/utility_template.md": technical_template
    }

    for path, content in files.items():
        full_path = os.path.join(base, path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w") as f:
            f.write(content)

    # Create zip archive
    zip_path = "docs/documentation_structure_template.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(base):
            for file in files:
                full = os.path.join(root, file)
                rel = os.path.relpath(full, base)
                z.write(full, rel)

    print(f"✅ Documentation templates created in: {base}")
    print(f"📦 Archive created: {zip_path}")
    return zip_path

if __name__ == "__main__":
    create_documentation_structure()
