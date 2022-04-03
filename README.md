### Conjector

Conjector is a man-made social for machines: it is based on the injection of RDF triples by users.

The social network automatically creates Quad from Triple, adding the graphic element ctx:assertedby to tie the assertion to its owner and ctx:assertionDate to preserve the timestamp of the assertion; thus is possible to preserve assertions context and unbound the semantic artifact from a single thruth.

To run the application clone the repo and add a "private" folder with 2 json as follows:

- crypto_secret.json
```json
{
    "secret": "<the secret to encrypt password>"
}
```

- token_credentials.json
```json
{
    "secret": "<the secret for the token>"
}
```
A simple proof of concept is available [here](http://conjector.herokuapp.com/ "Conjector").
