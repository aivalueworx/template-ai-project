#!/usr/bin/env bash
# setup.sh — run once after creating a new repo from this template.
# Replaces all placeholders in Markdown, MDC, YAML, and JSON files.
# Usage: bash setup.sh

set -euo pipefail

echo ""
echo "========================================"
echo "  AI Project Template — First-Run Setup"
echo "========================================"
echo ""

read -rp "Project name (e.g. my-api): " PROJECT_NAME
read -rp "GitHub org or username (e.g. acme-corp): " ORG
TODAY=$(date +%Y-%m-%d)

if [[ -z "$PROJECT_NAME" || -z "$ORG" ]]; then
  echo "❌ Project name and org are required."
  exit 1
fi

echo ""
echo "Replacing placeholders..."
echo "  Project: $PROJECT_NAME"
echo "  Org:     $ORG"
echo "  Date:    $TODAY"
echo ""

# Files to process
FILES=$(find . \
  \( -name "*.md" -o -name "*.mdc" -o -name "*.yml" -o -name "*.yaml" -o -name "*.json" \) \
  ! -path "./.git/*" \
  ! -path "./node_modules/*")

for file in $FILES; do
  # macOS-compatible sed (no -i '' issue with variables)
  sed -i.bak \
    -e "s/REPLACE-WITH-DATE/$TODAY/g" \
    -e "s/\[org\]/$ORG/g" \
    -e "s/your-org\/engineering/$ORG\/engineering/g" \
    -e "s/YOUR-REPO/$PROJECT_NAME/g" \
    -e "s/YOUR-ORG/$ORG/g" \
    -e "s/\[YOUR-ORG\]/$ORG/g" \
    -e "s/\[YOUR-REPO\]/$PROJECT_NAME/g" \
    "$file" 2>/dev/null && rm -f "${file}.bak"
done

# Update template-sync workflow to point to this repo's template
SYNC_WORKFLOW=".github/workflows/template-sync.yml"
if [ -f "$SYNC_WORKFLOW" ]; then
  sed -i.bak \
    -e "s|source_repo_path: aivalueworx/template-ai-project|source_repo_path: $ORG/$PROJECT_NAME|g" \
    "$SYNC_WORKFLOW" && rm -f "${SYNC_WORKFLOW}.bak"
fi

echo ""
echo "✅ Placeholders replaced."
echo ""
echo "Next steps:"
echo "  1. Fill in <!-- HUMAN-AUTHORED --> sections in:"
echo "     - AGENTS.md"
echo "     - CONVENTIONS.md"
echo "     - .github/copilot-instructions.md"
echo ""
echo "  2. Follow docs/cursor-automations-setup.md for the 3 Cursor Automations."
echo ""
echo "  3. Optional — install the Willison toolchain:"
echo "     pip install llm"
echo "     uvx install claude-code-transcripts"
echo "     uvx install files-to-prompt"
echo ""
echo "  4. Push and verify GitHub Actions run successfully."
echo ""
