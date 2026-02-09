# OrphaFold Makefile

.PHONY: all install dev build test help

all: install build

install:
	npm install

dev:
	npm run dev

build:
	npm run build

# Since there are no specific tests yet, we run the build to ensure compilation works
test: build

help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make dev      - Run development server"
	@echo "  make build    - Build the project"
	@echo "  make test     - Run tests (currently runs build)"
	@echo "  make help     - Show this help message"
