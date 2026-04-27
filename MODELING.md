# Schema Design — Personal Productivity Hub

> Fill in every section below. Keep answers concise.

---

## 1. Collections Overview

Briefly describe each collection (1–2 sentences each):

- **users** — Stores registered user accounts with hashed passwords.
- **projects** — Stores projects owned by a user; can be archived.
- **tasks** — Stores tasks belonging to a project, with embedded subtasks and tags.
- **notes** — Stores freeform notes, optionally linked to a project.

---

## 2. Document Shapes

For each collection, write the document shape (field name + type + required/optional):

### users
```
{
  _id: ObjectId,
  email: string (required, unique),
  passwordHash: string (required),
  name: string (required),
  createdAt: Date (required)
}
```

### projects
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, ref: users),
  name: string (required),
  description: string (optional),
  archived: boolean (required, default: false),
  createdAt: Date (required)
}
```

### tasks
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, ref: users),
  projectId: ObjectId (required, ref: projects),
  title: string (required),
  status: string (required, "todo"|"in-progress"|"done"),
  priority: number (required, default: 1),
  tags: [string] (required, default: []),
  subtasks: [{ title: string, done: boolean }] (required, default: []),
  createdAt: Date (required)
}
```
### notes
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, ref: users),
  projectId: ObjectId (optional, ref: projects),
  title: string (required),
  body: string (optional),
  tags: [string] (required, default: []),
  createdAt: Date (required)
}
```
---

## 3. Embed vs Reference — Decisions

For each relationship, state whether you embedded or referenced, and **why** (one sentence):

| Relationship | Embed or Reference? | Why? |
|---|---|---|
| Subtasks inside a task | Embed | Subtasks are always read with their task and owned exclusively by it |
| Tags on a task | Embed (array of strings) | Tags are simple scalars, always read with the task, no separate identity needed |
| Project → Task ownership | Reference (projectId in task) | Tasks are queried independently and a project can have many tasks |
| Note → optional Project link | Reference (projectId in note, optional) | Notes can exist without a project; referencing avoids duplication |

---

## 4. Schema Flexibility Example

Name one field that exists on **some** documents but not **all** in the same collection. Explain why this is acceptable (or even useful) in MongoDB.

> The `projectId` field in **notes** is present only when a note is linked to a project,
and absent on standalone notes. MongoDB allows this without a nullable column,
the field simply doesn't exist on unlinked documents, saving space and making
the optional relationship explicit at the document level.
