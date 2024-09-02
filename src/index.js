#!/usr/bin/env node

import chalk from "chalk"
import { InvalidArgumentError, program } from "commander"
import { CspEvaluator } from "csp_evaluator/dist/evaluator.js"
import { Severity } from "csp_evaluator/dist/finding.js"
import { CspParser } from "csp_evaluator/dist/parser.js"

program
  .command("validate <csp>")
  .description("Validate Content-Security-Policy")
  .option("--output-format [type]", "Output format", parseOutputFormat)
  .action(validate)

const formatJSON = (findings) => JSON.stringify(findings)
const formatJSONPretty = (findings) => JSON.stringify(findings, 0, 4)
const formatHuman = (findings) => {
  const findingsByDirective = findings.reduce((acc, finding) => {
    if (acc[finding.directive]) {
      acc[finding.directive].push(finding)
    } else {
      acc[finding.directive] = [finding]
    }
    return acc
  }, {})

  return Object.entries(findingsByDirective)
    .flatMap(([directive, ff]) => {
      const unspecific = ff.filter((f) => !f.value).map(formatHumanFinding)
      const specific = ff
        .filter((f) => f.value)
        .map(formatHumanFinding)
        .map((s) => `   ${s}`)
      if (specific.length > 0) {
        return [...unspecific, `${directive}:`, ...specific]
      }
      return unspecific
    })
    .join("\n")
}
const formatHumanFinding = (finding) => {
  return finding.value
    ? `${formatHumanSeverity(finding.severity)} ${finding.value}: ${finding.description}`
    : `${formatHumanSeverity(finding.severity)} ${finding.description}`
}
const formatHumanSeverity = (severity) => {
  switch (severity) {
    case Severity.HIGH:
      return chalk.red("!")
    case Severity.HIGH_MAYBE:
      return chalk.red("?")
    case Severity.MEDIUM:
      return chalk.yellow("!")
    case Severity.MEDIUM_MAYBE:
      return chalk.yellow("?")
    case Severity.SYNTAX:
      return chalk.cyan("x")
    case Severity.STRICT_CSP:
      return "-"
    case Severity.INFO:
      return chalk.blue("i")
    case Severity.NONE:
    default:
      return ""
  }
}

const outputFormats = {
  json: formatJSON,
  "json-pretty": formatJSONPretty,
  human: formatHuman,
}

function parseOutputFormat(value) {
  if (!outputFormats[value]) {
    const suportedFormats = Object.keys(outputFormats)
      .map((fmt) => `"${fmt}"`)
      .join(" | ")
    throw new InvalidArgumentError(`expected one of ${suportedFormats}`)
  }
  return value
}

function validate(input, options) {
  const parsed = new CspParser(input).csp
  const validator = new CspEvaluator(parsed)
  const findings = validator.evaluate()

  const isInvalidSyntax = findings.some((finding) => finding.severity === Severity.SYNTAX)

  const format = options.outputFormat ? outputFormats[options.outputFormat] : formatHuman

  if (isInvalidSyntax) {
    program.error(format(findings))
  } else {
    console.log(format(findings))
  }
}

program.parse()
