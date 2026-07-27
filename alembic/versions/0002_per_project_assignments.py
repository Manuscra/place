"""per-project assignments

Revision ID: 0002
Revises: 219c9201740b
Create Date: 2026-05-24 12:00:00.000000
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = '0002'
down_revision: str | None = '219c9201740b'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table('eleve_groupes',
        sa.Column('eleve_id', sa.Integer(), nullable=False),
        sa.Column('groupe_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['eleve_id'], ['eleves.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['groupe_id'], ['groupes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('eleve_id', 'groupe_id')
    )
    conn = op.get_bind()
    rows = conn.execute(
        sa.text("SELECT id, groupe_id FROM eleves WHERE groupe_id IS NOT NULL")
    ).fetchall()
    for eleve_id, groupe_id in rows:
        conn.execute(
            sa.text("INSERT INTO eleve_groupes (eleve_id, groupe_id) VALUES (:eid, :gid)"),
            {"eid": eleve_id, "gid": groupe_id}
        )
    with op.batch_alter_table('eleves') as batch_op:
        batch_op.drop_column('groupe_id')


def downgrade() -> None:
    with op.batch_alter_table('eleves') as batch_op:
        batch_op.add_column(sa.Column('groupe_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            'fk_eleves_groupe_id_groupes',
            'groupes', ['groupe_id'], ['id']
        )
    op.drop_table('eleve_groupes')
