const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const list = asyncHandler(async (req,res)=>{ const filter = req.user?.role === 'admin' && req.query.includeInactive === 'true' ? {} : {active:true}; res.json({data:await Category.find(filter).sort({name:1})}); });
const getOne = asyncHandler(async(req,res)=>{const c=await Category.findById(req.params.id); if(!c||(!c.active&&req.user?.role!=='admin')) throw new AppError('Categoría no encontrada',404,'CATEGORY_NOT_FOUND'); res.json({category:c});});
const create = asyncHandler(async(req,res)=>{const category=await Category.create(req.body); res.status(201).json({message:'Categoría creada',category});});
const update = asyncHandler(async(req,res)=>{const category=await Category.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}); if(!category) throw new AppError('Categoría no encontrada',404,'CATEGORY_NOT_FOUND'); res.json({message:'Categoría actualizada',category});});
const deactivate = asyncHandler(async(req,res)=>{const category=await Category.findByIdAndUpdate(req.params.id,{active:false},{new:true}); if(!category) throw new AppError('Categoría no encontrada',404,'CATEGORY_NOT_FOUND'); res.json({message:'Categoría desactivada',category});});
module.exports={list,getOne,create,update,deactivate};
