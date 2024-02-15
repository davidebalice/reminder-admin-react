function isAllowed(role, id, members, ownerId) {
  console.log("allow");
  console.log("role");
  console.log(role);
  console.log("id");
  console.log(id);
  console.log("members");
  console.log(members);
  console.log("ownerId");
  console.log(ownerId);

  if (role === "admin") {
    return true;
  } else {
    if (members && ownerId && id) {
      if (id === ownerId) {
        return true;
      } else {
        for (let i = 0; i < members.length; i++) {
          if (members[i]._id === id) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

export default isAllowed;
