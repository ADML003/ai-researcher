#!/bin/bash

# Script to clear all research data from the database
# This will preserve the database schema while removing all research records

echo "🧹 Research Data Cleanup Tool"
echo "=================================="
echo ""
echo "This script will clear all research data from the database while preserving the schema."
echo "Tables affected: research_sessions, personas, interviews"
echo ""

# Change to the backend directory
cd "$(dirname "$0")"

# Run the Python cleanup script
python3 clear_research_data.py

echo ""
echo "Done! 🎉"