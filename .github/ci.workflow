workflow "New workflow" {
  on = "push"
  resolves = ["npm test"]
}

action "npm ci" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "npm ci"
}

action "npm test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["npm ci"]
  runs = "npm test"
}
