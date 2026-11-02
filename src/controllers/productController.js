const Product = require('../models/Product');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const list = asyncHandler(async(req,res)=>{
 const page=Math.max(parseInt(req.query.page||'1',10),1), limit=Math.min(Math.max(parseInt(req.query.limit||'12',10),1),100);
 const filter={active:true}; if(req.query.category) filter.category=req.query.category;
 if(req.query.q) filter.$text={$search:String(req.query.q).slice(0,100)};
 const [data,total]=await Promise.all([Product.find(filter).populate('category','name slug').sort({createdAt:-1}).skip((page-1)*limit).limit(limit),Product.countDocuments(filter)]);
 res.json({data,pagination:{page,limit,total,pages:Math.ceil(total/limit)}});
});
const getOne=asyncHandler(async(req,res)=>{const product=await Product.findOne({_id:req.params.id,active:true}).populate('category','name slug'); if(!product) throw new AppError('Producto no encontrado',404,'PRODUCT_NOT_FOUND'); res.json({product});});
const create=asyncHandler(async(req,res)=>{const category=await Category.findOne({_id:req.body.category,active:true}); if(!category) throw new AppError('La categoría no existe o está desactivada',422,'INVALID_CATEGORY'); const product=await Product.create(req.body); res.status(201).json({message:'Producto creado',product});});
const update=asyncHandler(async(req,res)=>{if(req.body.category){const c=await Category.findOne({_id:req.body.category,active:true});if(!c)throw new AppError('La categoría no existe o está desactivada',422,'INVALID_CATEGORY');} const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}).populate('category','name slug');if(!product)throw new AppError('Producto no encontrado',404,'PRODUCT_NOT_FOUND');res.json({message:'Producto actualizado',product});});
const deactivate=asyncHandler(async(req,res)=>{const product=await Product.findByIdAndUpdate(req.params.id,{active:false},{new:true});if(!product)throw new AppError('Producto no encontrado',404,'PRODUCT_NOT_FOUND');res.json({message:'Producto desactivado',product});});
module.exports={list,getOne,create,update,deactivate};
