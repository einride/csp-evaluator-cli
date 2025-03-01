# Code generated by go.einride.tech/sage. DO NOT EDIT.
# To learn more, see .sage/main.go and https://github.com/einride/sage.

.DEFAULT_GOAL := default

cwd := $(dir $(realpath $(firstword $(MAKEFILE_LIST))))
sagefile := $(abspath $(cwd)/.sage/bin/sagefile)

# Setup Go.
go := $(shell command -v go 2>/dev/null)
export GOWORK ?= off
ifndef go
SAGE_GO_VERSION ?= 1.23.4
export GOROOT := $(abspath $(cwd)/.sage/tools/go/$(SAGE_GO_VERSION)/go)
export PATH := $(PATH):$(GOROOT)/bin
go := $(GOROOT)/bin/go
os := $(shell uname | tr '[:upper:]' '[:lower:]')
arch := $(shell uname -m)
ifeq ($(arch),x86_64)
arch := amd64
endif
$(go):
	$(info installing Go $(SAGE_GO_VERSION)...)
	@mkdir -p $(dir $(GOROOT))
	@curl -sSL https://go.dev/dl/go$(SAGE_GO_VERSION).$(os)-$(arch).tar.gz | tar xz -C $(dir $(GOROOT))
	@touch $(GOROOT)/go.mod
	@chmod +x $(go)
endif

.PHONY: $(sagefile)
$(sagefile): $(go)
	@cd .sage && $(go) mod tidy && $(go) run .

.PHONY: sage
sage:
	@$(MAKE) $(sagefile)

.PHONY: update-sage
update-sage: $(go)
	@cd .sage && $(go) get -d go.einride.tech/sage@latest && $(go) mod tidy && $(go) run .

.PHONY: clean-sage
clean-sage:
	@git clean -fdx .sage/tools .sage/bin .sage/build

.PHONY: backstage-validate
backstage-validate: $(sagefile)
	@$(sagefile) BackstageValidate

.PHONY: commitlint
commitlint: $(sagefile)
	@$(sagefile) Commitlint

.PHONY: default
default: $(sagefile)
	@$(sagefile) Default

.PHONY: format
format: $(sagefile)
	@$(sagefile) Format

.PHONY: git-verify-no-diff
git-verify-no-diff: $(sagefile)
	@$(sagefile) GitVerifyNoDiff

.PHONY: go-format
go-format: $(sagefile)
	@$(sagefile) GoFormat

.PHONY: go-lint
go-lint: $(sagefile)
	@$(sagefile) GoLint

.PHONY: go-lint-fix
go-lint-fix: $(sagefile)
	@$(sagefile) GoLintFix

.PHONY: install
install: $(sagefile)
	@$(sagefile) Install

.PHONY: install-immutable
install-immutable: $(sagefile)
	@$(sagefile) InstallImmutable

.PHONY: lint
lint: $(sagefile)
	@$(sagefile) Lint

.PHONY: release
release: $(sagefile)
	@$(sagefile) Release

.PHONY: review
review: $(sagefile)
	@$(sagefile) Review
