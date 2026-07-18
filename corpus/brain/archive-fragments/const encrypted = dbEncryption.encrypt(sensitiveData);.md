const encrypted = dbEncryption.encrypt(sensitiveData);  
await db.insert(table).values({  
  ...encrypted,  
  other_fields: 'data'  
});  
  
