const express = require('express');
const router = express.Router();
const clients = {
    users: {
        host: process.env.SERVICE_RPC_HOST,
        port: process.env.SERVICE_RPC_PORT
    }
};
const data = {}
const authenticator = require('../middlewares/authenticator')(clients, data);
const authenticateRole = require("../middlewares/authenticateRole");
const filterProjects = require("../middlewares/filterProjectsForRoles")();

const { getAllUsers, editUserDetails, addNewUser, getUserDetailsByUserId, getAllLeadsLisitng, getAllUsersNonPaginated, updateUserBlockStatus, getAllUsersListingNonPaginated, getUnAssignedUserLisitng, getTeamAnalytics} = require('../controllers/user');

//roles from config
const role = JSON.parse(process.env.role)

// Superadmin, Admin Add New Team Member
router.post("/v1/add", [authenticator, authenticateRole([role.admin, role.superadmin])], addNewUser);

//Superadmin, admin edit any user details ( provide userId )
// Lead edit either self or any user details ( provide userId )
// User, intern can edit only themself
router.patch("/v1/edit", [authenticator, authenticateRole([role.admin, role.superadmin, role.lead, role.contributor, role.intern, role.guest])], editUserDetails);

//get userby userId
router.get("/v1/userId", [authenticator], getUserDetailsByUserId);

// Get all users (except SA & A) - Non Paginated ( for dropdown )
router.get("/v1/all", [authenticator], getAllUsersListingNonPaginated);

// Get all users (except SA & A) - Pagination
router.get("/v1/all/pagination", [authenticator, filterProjects], getAllUsers);

//Users listing - Non Paginated ( for dropdown ) - Only User
router.get("/v1/list", [authenticator], getAllUsersNonPaginated);

// Get list of leads role - Non Paginated( for dropdown ) - Only Lead
router.get("/v1/leads/list", [], getAllLeadsLisitng);

// Get list of unassigned leads/user role - Non Paginated( for dropdown )
router.get("/v1/unassigned/list", [], getUnAssignedUserLisitng);

//Update User Status
router.patch("/v1/edit/block/status", [authenticator, authenticateRole([role.admin, role.superadmin])], updateUserBlockStatus);

//get team analytics
router.get("/v1/team/analytics", 
[authenticator], 
getTeamAnalytics);


module.exports = router;

