"""add_qcm_tables

Revision ID: d364068c2502
Revises: 3b34dcf81a6b
Create Date: 2026-06-23 13:44:42.874391
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision: str = 'd364068c2502'
down_revision: Union[str, None] = '3b34dcf81a6b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_exists(name: str) -> bool:
    conn = op.get_bind()
    inspector = inspect(conn)
    return name in inspector.get_table_names()


def upgrade() -> None:
    if not _table_exists('Act_Attrib'):
        op.create_table('Act_Attrib',
        sa.Column('No-Act_Attrib', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('No_Niv_Attrib', sa.Integer(), nullable=False),
        sa.Column('No_Act_Attrib', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('No-Act_Attrib')
        )
    if not _table_exists('Activite'):
        op.create_table('Activite',
        sa.Column('No_Act', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('Type_Act', sa.Integer(), nullable=True),
        sa.Column('Name_Act', sa.String(length=48), nullable=False),
        sa.Column('No_dImg', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('No_Act')
        )
    if not _table_exists('Attrib_Chap'):
        op.create_table('Attrib_Chap',
        sa.Column('No_Attrib', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('No_dChap', sa.Integer(), nullable=False),
        sa.Column('No_dAct', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('No_Attrib')
        )
    if not _table_exists('Attrib_Niv'):
        op.create_table('Attrib_Niv',
        sa.Column('No_Niv_Attrib', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('No_dChap', sa.Integer(), nullable=False),
        sa.Column('No_dNiv', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('No_Niv_Attrib')
        )
    if not _table_exists('Chap'):
        op.create_table('Chap',
        sa.Column('No_chap', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('Name_Chap', sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint('No_chap')
        )
    if not _table_exists('Etiquettes'):
        op.create_table('Etiquettes',
        sa.Column('No_Etiqu', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('x', sa.Integer(), nullable=False),
        sa.Column('y', sa.Integer(), nullable=False),
        sa.Column('No_liste', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('No_Etiqu')
        )
    if not _table_exists('Img'):
        op.create_table('Img',
        sa.Column('No_Img', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('N_Img', sa.String(length=256), nullable=False),
        sa.PrimaryKeyConstraint('No_Img')
        )
    if not _table_exists('Liens'):
        op.create_table('Liens',
        sa.Column('No_Lien', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('No_dAct', sa.Integer(), nullable=True),
        sa.Column('Link', sa.String(length=256), nullable=False),
        sa.PrimaryKeyConstraint('No_Lien')
        )
    if not _table_exists('Listes'):
        op.create_table('Listes',
        sa.Column('No_Liste', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('Act_liste', sa.Integer(), nullable=False),
        sa.Column('Num_Liste_Base', sa.Integer(), nullable=False),
        sa.Column('Num_Liste_Act', sa.Integer(), nullable=False),
        sa.Column('Num_Rep', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('No_Liste')
        )
    if not _table_exists('Niveau'):
        op.create_table('Niveau',
        sa.Column('No_Niv', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('Name_Niv', sa.Text(), nullable=False),
        sa.Column('qcm_active', sa.Integer(), nullable=False),
        sa.Column('qcm_bg', sa.Text(), nullable=True),
        sa.Column('qcm_theme', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('No_Niv')
        )
    if not _table_exists('Reponses'):
        op.create_table('Reponses',
        sa.Column('No_Rep', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('Reponse', sa.String(length=32), nullable=False),
        sa.PrimaryKeyConstraint('No_Rep')
        )
    if not _table_exists('Type'):
        op.create_table('Type',
        sa.Column('No_Type', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('Name_Type', sa.String(length=6), nullable=False),
        sa.PrimaryKeyConstraint('No_Type')
        )


def downgrade() -> None:
    if _table_exists('Type'):
        op.drop_table('Type')
    if _table_exists('Reponses'):
        op.drop_table('Reponses')
    if _table_exists('Niveau'):
        op.drop_table('Niveau')
    if _table_exists('Listes'):
        op.drop_table('Listes')
    if _table_exists('Liens'):
        op.drop_table('Liens')
    if _table_exists('Img'):
        op.drop_table('Img')
    if _table_exists('Etiquettes'):
        op.drop_table('Etiquettes')
    if _table_exists('Chap'):
        op.drop_table('Chap')
    if _table_exists('Attrib_Niv'):
        op.drop_table('Attrib_Niv')
    if _table_exists('Attrib_Chap'):
        op.drop_table('Attrib_Chap')
    if _table_exists('Activite'):
        op.drop_table('Activite')
    if _table_exists('Act_Attrib'):
        op.drop_table('Act_Attrib')
