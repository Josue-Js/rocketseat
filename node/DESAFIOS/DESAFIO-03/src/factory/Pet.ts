import type { Pet } from '@prisma/client'
import { randomUUID } from 'crypto'

type Override = Omit<Pet, 'id' | 'created_at'>;

export function makePet(data: Partial<Override>) {
    const pet: Pet = {
        id: randomUUID(),
        about: data.about ?? 'cutie pet',
        energia: data.energia ?? 0,
        age: data.age ?? 'PUPPY',
        name: data.name ?? '',
        size: data.size ?? 'MEDIUM_SIZED',
        environment: data.environment ?? 'LARGE',
        level_of_independence: data.level_of_independence ?? 3,
        requirements: data.requirements ?? [],
        org_id: data.org_id ?? 'ORG-01',
        created_at: new Date
    }   
    
    return pet
}

