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

const { assignManager, activeGuest, getAllUsers, editUserDetails, addNewUser, getUserDetailsByUserId, getUserListing, getAllLeadsListing, deleteUser, getAllLeadsLisitng, getAllUsersNonPaginated, updateUserBlockStatus, getAllUsersListingNonPaginated, getUnAssignedUserLisitng, getTeamAnalytics, getAllGuest, verifyUserForRating } = require('../controllers/user');

// Superadmin, Admin Add New Team Member
router.post("/v1/add", [authenticator, authenticateRole(["ADMIN", "SUPER_ADMIN"])], addNewUser);

//Superadmin, admin edit any user details ( provide userId )
// Lead edit either self or any user details ( provide userId )
// User, intern can edit only themself
router.patch("/v1/edit", [authenticator, authenticateRole(["ADMIN", "SUPER_ADMIN", "CONTRIBUTOR", "INTERN", "LEAD", "GUEST"])], editUserDetails);


router.get('/v1/verify/manager', [authenticator], verifyUserForRating)
// Route to assign Manager
router.patch("/v1/assign/manager", [authenticator, authenticateRole(["ADMIN", "SUPER_ADMIN"])], assignManager);

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
router.patch("/v1/edit/block/status", [authenticator, authenticateRole(["ADMIN", "SUPER_ADMIN"])], updateUserBlockStatus);

//get team analytics
router.get("/v1/team/analytics",
    [authenticator],
    getTeamAnalytics);

//delete user
router.patch("/v1/delete/user",
    [authenticator, authenticateRole(["ADMIN", "SUPER_ADMIN"])],
    deleteUser);

// Active or Inactive Guest
router.patch("/v1/active/guest",
    [authenticator, authenticateRole(["ADMIN", "SUPER_ADMIN"])],
    activeGuest);

// Get all Guest (except SA , A, lEAD, Contributor) - Pagination
router.get("/v1/guest/pagination", [authenticator, filterProjects], getAllGuest);

// Get all users (except SA) - Non Paginated ( for dropdown )
router.get("/v1/all/users", [authenticator], getUserListing);

// Get all leads/admin ( for dropdown )
router.get("/v1/all/leads",
    [authenticator],
    getAllLeadsListing);

module.exports = router;

