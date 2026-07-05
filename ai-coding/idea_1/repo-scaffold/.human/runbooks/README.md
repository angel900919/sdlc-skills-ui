# Runbooks

Step-by-step operational procedures for things that happen under pressure — deploys, rollbacks, incident
response. Written so a tired human at 3 a.m. (or an ops agent) can follow them exactly.

- One file per procedure (`example-deploy.md` is a starter).
- Every destructive step states its blast radius and how to reverse it.
- If an agent runs a runbook, it follows the autonomy ladder (read-only → advised → approved → bounded-autonomous)
  and fires autonomously only when confidence is high AND the action is reversible (see the AIOps guide).
