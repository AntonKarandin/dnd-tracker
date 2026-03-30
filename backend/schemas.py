from pydantic import BaseModel, Field


class CreatureCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=300)
    max_hp: int
    hp: int
    temp_hp: int = Field(default=0)
    ac: int
    speed: int
    initiative: int


class CreatureOut(CreatureCreate):
    id: int

    model_config = {"from_attributes": True}


class CreatureUpdate(BaseModel):
    hp: int | None = None
    max_hp: int | None = None
    temp_hp: int | None = None
    ac: int | None = None
    initiative: int | None = None


class CombatInstanceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=300)
    max_hp: int
    hp: int
    temp_hp: int = Field(default=0)
    ac: int
    speed: int
    initiative: int
    number: int


class CombatInstanceOut(CombatInstanceCreate):
    id: int
    creature_id: int

    model_config = {"from_attributes": True}


class CombatInstanceUpdate(BaseModel):
    hp: int | None = None
    max_hp: int | None = None
    temp_hp: int | None = None
    ac: int | None = None
    initiative: int | None = None


class AmountIn(BaseModel):
    amount: int = Field(..., gt=0)