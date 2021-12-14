const {MongoClient} = require('mongodb');


// Main function that executes CRUD
async function main() {
	const uri = "mongodb+srv://magyen:3xjxNziv@cluster0.j0gko.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

  const client = new MongoClient(uri);

  try {
      await client.connect();
      // await listDatabases(client);
      await findOneListingByName(client, "Physics")
      await updateListingbyStatus(client, "Physics", {taken: true})
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

}

// filters for certain names
async function findOneListingByName(client, nameOfListing){
  const result = await client.db("CS20Final").collection("books").findOne({name: nameOfListing});

  if(result){
    console.log("worked")
    console.log(result);
  } else {
    console.log("not found");
  }
}

async function updateListingbyStatus(client, nameOfListing, updated_status){
  const result = await client.db("CS20Final").collection("books").updateOne({ name : nameOfListing} , {$set: updated_status});

  if(result){
    console.log("worked")
    console.log(result);
  } else {
    console.log("not found");
  }
}

main().catch(console.error);

// async function listDatabases(client) {
//   const databasesList = await client.db().admin().listDatabases();
//
//   console.log("Databases:")
//   databasesList.databases.forEach(db => {
//     console.log(`- ${db.name}`);
//   })
// }
