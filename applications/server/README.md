# Server

## ADRs

### Tracking new actions

#### Context
The websocket server needs to know when new actions are inserted into the `actions` table, so that it can send messages to clients.

#### Decision
We will poll (pull) the `actions` table. This is straightforward and forgiving of schema changes (unlike LISTEN/NOTIFY, which requires triggers).

#### Consequences
Polling induces unnecessary load. We will have to begin (tail) from the latest record. Multiple rows per query could be returned.
