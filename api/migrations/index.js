import { v0 } from './00'


const migrations = [
  v0,
]


export async function migrate (versionedState) {
  return migrations.reduce(async (newVersionedState, { migration }) => {
    const state = await newVersionedState
    return migration(state)
  }, Promise.resolve(versionedState))
}