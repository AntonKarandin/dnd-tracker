from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.database import get_db
from backend.models import CombatInstance, Creature
from backend.schemas import CombatInstanceCreate, CombatInstanceUpdate, CombatInstanceOut, AmountIn

router = APIRouter(prefix="/api/combat", tags=["combats"])


@router.get("", response_model=list[CombatInstanceOut])
async def list_combat(db: AsyncSession = Depends(get_db),
                         search: str | None = None):
    query = select(CombatInstance).order_by(CombatInstance.initiative.desc())
    if search:
        query = query.where(CombatInstance.name.ilike(f"%{search}%"))
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/{creature_id}/spawn",
             response_model=list[CombatInstanceOut],
             status_code=status.HTTP_201_CREATED)
async def spawn_create(
        creature_id: int,
        count: int = 1,
        db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Creature).where(Creature.id == creature_id)
    )
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=404, detail="Creature not found")

    existing = await db.execute(
        select(CombatInstance).where(CombatInstance.creature_id == creature_id)
    )
    current_count = len(existing.scalars().all())

    created = []
    for i in range(1, count+1):
        instance = CombatInstance(
            creature_id=template.id,
            name=template.name,
            number=current_count+i,
            max_hp=template.max_hp,
            hp=template.max_hp,
            temp_hp=0,
            ac=template.ac,
            speed=template.speed,
            initiative=0
        )
        db.add(instance)
        created.append(instance)

    await db.commit()
    for c in created:
        await db.refresh(c)
    return created


async def _get_creature_or_404(id: int, db: AsyncSession) -> CombatInstance:
    result = await db.execute(
        select(CombatInstance).where(CombatInstance.id == id)
    )
    combat = result.scalar_one_or_none()
    if not combat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Creature not found")
    return combat


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_combat_creature(id: int, db: AsyncSession = Depends(get_db)):
    combat = await _get_creature_or_404(id, db)
    await db.delete(combat)
    await db.commit()


@router.patch("/{id}", response_model=CombatInstanceOut)
async def update_combat_creature(id: int, payload: CombatInstanceUpdate,db: AsyncSession = Depends(get_db)):
    combat = await _get_creature_or_404(id, db)

    if payload.temp_hp is not None:
        combat.temp_hp = max(combat.temp_hp, payload.temp_hp)

    if payload.ac is not None:
        combat.ac = combat.ac + payload.ac

    if payload.initiative is not None:
        combat.initiative = payload.initiative

    if payload.max_hp is not None:
        combat.max_hp = payload.max_hp
        combat.hp = min(combat.max_hp, combat.hp)

    await db.commit()
    await db.refresh(combat)
    return combat


@router.post("/{id}/damage", response_model=CombatInstanceOut)
async def damage_in(id: int, damage: AmountIn, db: AsyncSession = Depends(get_db)):
    combat = await _get_creature_or_404(id, db)
    if combat.temp_hp > 0 and combat.temp_hp > damage.amount:
        combat.temp_hp = combat.temp_hp - damage.amount
    elif combat.temp_hp > 0 and combat.temp_hp < damage.amount:
        combat.hp = combat.hp - damage.amount + combat.temp_hp
        combat.temp_hp = 0
    else:
        combat.hp = combat.hp - damage.amount

    combat.hp = max(0, combat.hp)

    await db.commit()
    await db.refresh(combat)
    return combat


@router.post("/{id}/heal", response_model=CombatInstanceOut)
async def heal_in(id: int, heal: AmountIn, db: AsyncSession = Depends(get_db)):
    combat = await _get_creature_or_404(id, db)
    combat.hp = combat.hp + heal.amount
    combat.hp = min(combat.max_hp, combat.hp)

    await db.commit()
    await db.refresh(combat)
    return combat

