from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
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

    instances: Mapped[list["CombatInstance"]] = relationship(
        "CombatInstance",
        back_populates="creature",
        cascade="all, delete-orphan"
    )


class CombatInstance(Base):
    __tablename__ = "combat_instance"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    creature_id: Mapped[int] = mapped_column(ForeignKey("creatures.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    max_hp: Mapped[int] = mapped_column(Integer, nullable=False, default=50)
    hp: Mapped[int] = mapped_column(Integer, nullable=False)
    temp_hp: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    ac: Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    speed: Mapped[int] = mapped_column(Integer, nullable=False, default=30)
    initiative: Mapped[int] = mapped_column(Integer, nullable=False, default=10)

    creature: Mapped["Creature"] = relationship("Creature", back_populates="instances")
