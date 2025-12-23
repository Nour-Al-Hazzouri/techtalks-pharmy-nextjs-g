When I send a PUT or PATCH request to update a resource, Laravel validation treats all fields as required, even if I only want to update one or two fields.

For example, if my model has:

name

email

phone

address

and I send a PATCH request with only:

{
  "name": "New Name"
}


Laravel returns validation errors like:

"The email field is required."
"The phone field is required."
(and more)

What I want:

Update only the fields sent in the request body

Keep all other fields unchanged in the database

Proper validation for partial updates