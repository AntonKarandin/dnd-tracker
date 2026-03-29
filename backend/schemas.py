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
    hp: int | None
    temp_hp: int | None
    ac: int | None
    speed: int | None
    initiative: int | None
