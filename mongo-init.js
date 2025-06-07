db = db.getSiblingDB('tensillabs-lite');

db.createUser({
  user: 'tensillabs',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'tensillabs-lite'
    }
  ]
});
