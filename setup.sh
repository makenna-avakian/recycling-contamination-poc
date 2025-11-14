#!/bin/bash

# Setup script for recycling-contamination-poc database
# This script creates the database and runs the schema

set -e  # Exit on any error

# Add PostgreSQL bin directory to PATH (for Homebrew installations)
if [ -d "/opt/homebrew/opt/postgresql@15/bin" ]; then
    export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
elif [ -d "/usr/local/opt/postgresql@15/bin" ]; then
    export PATH="/usr/local/opt/postgresql@15/bin:$PATH"
fi

DB_NAME="recycling_contamination"
SCHEMA_FILE="db/schema.sql"
SEED_FILE="db/seed.sql"

echo "🚀 Setting up recycling contamination database..."
echo ""

# Check if PostgreSQL is running by trying to connect
if ! psql -l > /dev/null 2>&1; then
    echo "❌ PostgreSQL doesn't seem to be running or accessible."
    echo "   Please start it with: brew services start postgresql@15"
    echo "   (or your PostgreSQL version)"
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Create database (ignore error if it already exists)
echo "📦 Creating database '$DB_NAME'..."
createdb "$DB_NAME" 2>/dev/null || echo "   Database already exists, continuing..."
echo ""

# Run schema
echo "📋 Running schema..."
psql "$DB_NAME" -f "$SCHEMA_FILE"
echo ""

# Check if seed file has content and run it
if [ -f "$SEED_FILE" ] && [ -s "$SEED_FILE" ]; then
    echo "🌱 Running seed data..."
    psql "$DB_NAME" -f "$SEED_FILE"
    echo ""
fi

# Verify tables were created
echo "✅ Verifying tables..."
psql "$DB_NAME" -c "\dt" | head -20
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To connect to your database, run:"
echo "   psql $DB_NAME"
echo ""

