from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database import get_db
from backend.models import Creature
from backend.schemas import CreatureCreate, CreatureUpdate, CreatureOut

router = APIRouter(prefix="/api/tracker", tags=["tracker"])


@router.get("", response_model=list[CreatureOut])
async def list_creatures(db: AsyncSession = Depends(get_db),
                         search: str | None = None):
    query = select(Creature).order_by(Creature.initiative.desc())
    if search:
        query = query.where(Creature.name.ilike(f"{search}"))
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=CreatureOut, status_code=status.HTTP_201_CREATED)
async def create_creature(payload: CreatureCreate, db: AsyncSession = Depends(get_db)):
    creache = Creature(
        name=payload.name,
        max_hp=payload.max_hp,
        hp=payload.hp,
        temp_hp=payload.temp_hp,
        ac=payload.ac,
        speed=payload.speed,
        initiative=payload.initiative
    )
    db.add(creache)
    await db.commit()
    await db.refresh(creache)
    return creache


async def _get_creature_or_404(id: int, db: AsyncSession) -> Creature:
    result = await db.execute(
        select(Creature).where(Creature.id == id)
    )
    creature = result.scalar_one_or_none()
    if not creature:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Creature not found")
    return creature


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_creature(id: int, db: AsyncSession = Depends(get_db)):
    creature = await _get_creature_or_404(id, db)
    await db.delete(creature)
    await db.commit()


@router.patch("/{id}", response_model=CreatureOut)
async def update_creature(id: int, payload: CreatureUpdate,db: AsyncSession = Depends(get_db)):
    creature = await _get_creature_or_404(id, db)

    if payload.temp_hp is not None:
        creature.temp_hp = max(creature.temp_hp, payload.temp_hp)

    if payload.ac is not None:
        creature.ac = creature.ac + payload.ac

    if payload.initiative is not None:
        creature.initiative = payload.initiative

    if payload.max_hp is not None:
        creature.max_hp = payload.max_hp
        creature.hp = min(creature.max_hp, creature.hp)

    await db.commit()
    await db.refresh(creature)
    return creature
