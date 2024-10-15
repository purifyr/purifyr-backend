const allRoles = {
  user: ['getUsers', 'manageUsers', 'getReports', 'manageReports', 'createReport', 'getOwnReports'],
  admin: ['getUsers', 'manageUsers', 'getReports', 'manageReports'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
