package main

import (
	"context"

	"go.einride.tech/sage/sg"
	"go.einride.tech/sage/tools/sgbackstage"
	"go.einride.tech/sage/tools/sggit"
	"go.einride.tech/sage/tools/sggolangcilint"
	"go.einride.tech/sage/tools/sggolines"
)

func main() {
	sg.GenerateMakefiles(
		sg.Makefile{
			Path:          sg.FromGitRoot("Makefile"),
			DefaultTarget: Default,
		},
	)
}

func Default(ctx context.Context) error {
	sg.Deps(ctx, Install)
	sg.Deps(ctx, Review)
	sg.SerialDeps(ctx, GitVerifyNoDiff)
	return nil
}

func Install(ctx context.Context) error {
	sg.Logger(ctx).Println("installing dependencies...")
	return sg.Command(ctx, "yarn", "install").Run()
}

func InstallImmutable(ctx context.Context) error {
	sg.Logger(ctx).Println("installing dependencies...")
	return sg.Command(ctx, "yarn", "install", "--immutable").Run()
}

func Review(ctx context.Context) error {
	sg.Deps(ctx,
		Lint, Format,
		Commitlint,
		GoLint, GoFormat,
		BackstageValidate,
	)
	return nil
}

func Commitlint(ctx context.Context) error {
	sg.Logger(ctx).Println("formatting...")
	cmd := sg.Command(ctx, "yarn", "commitlint", "--from", "origin/master", "--to", "HEAD")
	return cmd.Run()
}

func Lint(ctx context.Context) error {
	sg.Logger(ctx).Println("formatting...")
	cmd := sg.Command(ctx, "yarn", "eslint", "--ext", "js", ".")
	return cmd.Run()
}

func Format(ctx context.Context) error {
	sg.Logger(ctx).Println("formatting...")
	cmd := sg.Command(ctx, "yarn", "prettier", "--write", ".")
	return cmd.Run()
}

func GoLint(ctx context.Context) error {
	sg.Logger(ctx).Println("linting Go files...")
	return sggolangcilint.Run(ctx)
}

func GoLintFix(ctx context.Context) error {
	sg.Logger(ctx).Println("fixing Go files...")
	return sggolangcilint.Fix(ctx)
}

func GoFormat(ctx context.Context) error {
	sg.Logger(ctx).Println("formatting Go files...")
	return sggolines.Run(ctx)
}

func BackstageValidate(ctx context.Context) error {
	sg.Logger(ctx).Println("validating Backstage files...")
	return sgbackstage.Validate(ctx)
}

func GitVerifyNoDiff(ctx context.Context) error {
	sg.Logger(ctx).Println("verifying that git has no diff...")
	return sggit.VerifyNoDiff(ctx)
}

func Release(ctx context.Context) error {
	sg.Logger(ctx).Println("releasing...")
	sg.Deps(ctx, InstallImmutable)
	cmd := sg.Command(ctx, "yarn", "semantic-release")
	return cmd.Run()
}
