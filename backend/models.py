from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column
from backend.database import Base


class Creature(Base):
    __tablename__ = 'creatures'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    max_hp: Mapped[int] = mapped_column(Integer, nullable=False, default=50)
    hp: Mapped[int] = mapped_column(Integer, nullable=False)
    temp_hp: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    ac: Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    speed: Mapped[int] = mapped_column(Integer, nullable=False, default=30)
    initiative: Mapped[int] = mapped_column(Integer, nullable=False, default=10)

