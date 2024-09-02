# csp-evaluator-cli

A command line tool that wraps [csp-evaluator].

## Usage

CLI interface strives to mimic [CSP Evaluator online tool]. It takes Content Security Policy as a string,
and outputs findings based on that into stdout.

### Output format

There are three supported output formats:

1. **human** (default)

Mimics [CSP Evaluator online tool] output.

```
> csp validate "script-src https://google.com"
! Missing object-src allows the injection of plugins which can execute JavaScript. Can you set it to 'none'?
script-src:
   ? https://google.com: No bypass found; make sure that this URL doesn't serve JSONP replies or Angular libraries.
```

2. **json**

JSON is passed as is from [csp-evaluator] output.

```
> csp validate --output-format=json "script-src https://google.com"
[{"type":300,"description":"Missing object-src allows the injection of plugins which can execute JavaScript. Can you set it to 'none'?","severity":10,"directive":"object-src"},{"type":305,"description":"No bypass found; make sure that this URL doesn't serve JSONP replies or Angular libraries.","severity":50,"directive":"script-src","value":"https://google.com"}]
```

3. **json-pretty**

Same as **json**, but with indentations.

```
> csp validate --output-format=json-pretty "script-src https://google.com"
[
    {
        "type": 300,
        "description": "Missing object-src allows the injection of plugins which can execute JavaScript. Can you set it to 'none'?",
        "severity": 10,
        "directive": "object-src"
    },
    {
        "type": 305,
        "description": "No bypass found; make sure that this URL doesn't serve JSONP replies or Angular libraries.",
        "severity": 50,
        "directive": "script-src",
        "value": "https://google.com"
    }
]
```

### Exit codes

Exit code is always 0, except for a case when a policy contains syntax errors.

```
> csp validate "script https://google.com"
! Missing object-src allows the injection of plugins which can execute JavaScript. Can you set it to 'none'?
! script-src directive is missing.
x Directive "script" is not a known CSP directive.
> $?
> 1
```

### Input

1. As an argument

```
> csp validate "script-src https://google.com"
```

2. From stdin

```
> echo "script-src https://google.com" | csp validate -
```

3. From a file

```
> echo "script-src https://google.com" > policy.txt
> csp validate policy.txt
```

## Contribute

See [Contributing Guide](./CONTRIBUTING.md).

## Security Policy

See [Security Policy](./SECURITY.md).

## License

[MIT](./LICENSE)

[csp evaluator online tool]: https://csp-evaluator.withgoogle.com/
[csp-evaluator]: https://github.com/google/csp-evaluator
