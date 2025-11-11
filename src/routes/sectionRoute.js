const { createNewSection, updateSectionBySectionId, getAllSections, deleteSectionByUserId } = require('../controllers/SectionController');
const { isAuth } = require('../middleware/isAuth');

const sectionRoute = require('express').Router();


sectionRoute.post(`/section`, isAuth, createNewSection );
sectionRoute.patch(`/section/:sectionId`, isAuth, updateSectionBySectionId );
sectionRoute.get(`/sections`, isAuth, getAllSections );
sectionRoute.delete(`/section/:sectionId`, isAuth, deleteSectionByUserId );

module.exports = sectionRoute;