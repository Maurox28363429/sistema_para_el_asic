//https://supabase.com/docs/reference/javascript/upsert
import { createClient } from '@supabase/supabase-js'
// Create a single supabase client for interacting with your database
// url https://lyikdkydcxiukrhkrqwz.supabase.co
// jwt
const supabase = createClient(
  'https://lyikdkydcxiukrhkrqwz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5aWtka3lkY3hpdWtyaGtycXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY0ODY2NjQsImV4cCI6MTk5MjA2MjY2NH0.vXdKg0LU2Lj69lXy0Y7c8oVZBAMZgJFdYJ7KdbDD7nE'
  )
export default supabase;

//leer informacion
/*
  codigo
const { data, error } = await supabase
  .from('countries')
  .select()
*/
/*
  Filtro por igualdad
  .eq('name', 'The Shire')
  Filtro por menor
  gte('population', filterPopLow)
  Filtro por mayor
  lt('population', filterPopHigh)
  Filtro en JSON por igualdad
  .eq('address->postcode', 90210)

  cuando son relaciones
  const { data, error } = await supabase
  .from('countries')
  .select(`
    name,
    cities!inner (
      name
    )
  `)
  .eq('cities.name', 'Bali')
*/
/*
  Response
{
  "data": [
    {
      "id": 1,
      "name": "Afghanistan"
    },
    {
      "id": 2,
      "name": "Albania"
    },
    {
      "id": 3,
      "name": "Algeria"
    }
  ],
  "status": 200,
  "statusText": "OK"
}
*/


// Insertar datos
/*
  Codigo
const { error } = await supabase
  .from('countries')
  .insert({ id: 1, name: 'Denmark' })
*/

/*
  Response

{
  "status": 201,
  "statusText": "Created"
}
*/


// Actualizar

/*
  Codigo
const { error } = await supabase
  .from('countries')
  .update({ name: 'Australia' })
  .eq('id', 1)
*/

/*
  Response
{
  "status": 204,
  "statusText": "No Content"
}
*/

// Si existe crear si no devolver
/*
const { data, error } = await supabase
  .from('countries')
  .upsert({ id: 1, name: 'Albania' })
  .select()
*/

/*
  Response
{
  "data": [
    {
      "id": 1,
      "name": "Albania"
    }
  ],
  "status": 201,
  "statusText": "Created"
}
*/

//borrar
/*
  const { error } = await supabase
  .from('countries')
  .delete()
  .eq('id', 1)
*/

/*
  {
  "status": 204,
  "statusText": "No Content"
}
*/
