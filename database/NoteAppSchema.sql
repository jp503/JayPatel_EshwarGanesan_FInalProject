-- 1. create tables


CREATE TABLE IF NOT EXISTS notes (
    id                 BIGSERIAL    PRIMARY KEY,
    title              VARCHAR(255) NOT NULL,
    content            TEXT,
	created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pinned             BOOLEAN      NOT NULL DEFAULT FALSE,
    pinned_at          TIMESTAMP    NULL,
    password_protected BOOLEAN      NOT NULL DEFAULT FALSE,
    password_hash      VARCHAR(255) NULL

);

CREATE TABLE IF NOT EXISTS tags (
    id   BIGSERIAL    PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS note_tags (
    id      BIGSERIAL PRIMARY KEY,
    note_id BIGINT    NOT NULL,
    tag_id  BIGINT    NOT NULL,
    CONSTRAINT fk_note_tags_note FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    CONSTRAINT fk_note_tags_tag  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE,
    UNIQUE(note_id, tag_id)
);

-- 2. add tags


INSERT INTO tags (name) VALUES
    ('work'),
    ('personal'),
    ('ideas'),
    ('urgent'),
    ('reading list'),
    ('finance'),
    ('health');

-- 3. add notes

INSERT INTO notes (title, content) VALUES
    (
        'Q3 project kickoff',
        'Align with the team on deliverables for Q3. Book rooms, send calendar invites, prepare slide deck.'
    ),
    (
        'Book recommendations',
        'Deep Work by Cal Newport. The Pragmatic Programmer. Clean Architecture by Robert C. Martin.'
    ),
    (
        'Grocery run',
        'Milk, eggs, sourdough bread, olive oil, cherry tomatoes, pasta.'
    ),
    (
        'App feature ideas',
        'Dark mode toggle. Offline support via service workers. Drag and drop note reordering.'
    ),
    (
        'Monthly budget review',
        'Check subscriptions, review discretionary spending, move surplus to savings.'
    ),
    (
        'Morning routine',
        '7am wake up. 20 min walk. Journaling. No phone for first hour.'
    ),
    (
        'Urgent: renew insurance',
        'Policy expires end of month. Compare quotes on at least 3 providers before renewing.'
    );

-- 4. add note_tags

INSERT INTO note_tags (note_id, tag_id)
SELECT n.id, t.id FROM notes n, tags t
WHERE (n.title = 'Q3 project kickoff'      AND t.name IN ('work', 'urgent'))
   OR (n.title = 'Book recommendations'    AND t.name IN ('personal', 'reading list'))
   OR (n.title = 'Grocery run'             AND t.name =  'personal')
   OR (n.title = 'App feature ideas'       AND t.name IN ('work', 'ideas'))
   OR (n.title = 'Monthly budget review'   AND t.name IN ('personal', 'finance'))
   OR (n.title = 'Morning routine'         AND t.name IN ('personal', 'health'))
   OR (n.title = 'Urgent: renew insurance' AND t.name IN ('urgent', 'finance'));