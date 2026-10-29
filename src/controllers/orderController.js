const Order=require('../models/Order');
const { cancelOrder } = require('../services/orderService');
const AppError=require('../utils/AppError');
const asyncHandler=require('../utils/asyncHandler');
const {createOrder}=require('../services/orderService');
const create=asyncHandler(async(req,res)=>{const order=await createOrder(req.user._id,req.body.items);res.status(201).json({message:'Orden creada; pago simulado, no se realizó ningún cobro',order});});
const mine=asyncHandler(async(req,res)=>{const page=Math.max(parseInt(req.query.page||'1',10),1),limit=Math.min(Math.max(parseInt(req.query.limit||'20',10),1),100);const [data,total]=await Promise.all([Order.find({user:req.user._id}).sort({createdAt:-1}).skip((page-1)*limit).limit(limit),Order.countDocuments({user:req.user._id})]);res.json({data,pagination:{page,limit,total,pages:Math.ceil(total/limit)}});});
const listAll=asyncHandler(async(req,res)=>{const page=Math.max(parseInt(req.query.page||'1',10),1),limit=Math.min(Math.max(parseInt(req.query.limit||'20',10),1),100);const [data,total]=await Promise.all([Order.find().populate('user','name email').sort({createdAt:-1}).skip((page-1)*limit).limit(limit),Order.countDocuments()]);res.json({data,pagination:{page,limit,total,pages:Math.ceil(total/limit)}});});
const getOne=asyncHandler(async(req,res)=>{const order=await Order.findById(req.params.id);if(!order)throw new AppError('Orden no encontrada',404,'ORDER_NOT_FOUND');if(req.user.role!=='admin'&&String(order.user)!==String(req.user._id))throw new AppError('No puedes consultar órdenes de otro usuario',403,'FORBIDDEN');res.json({order});});
const cancel = asyncHandler(async (req, res) => {
  const order = await cancelOrder(
    req.params.id,
    req.user._id,
    req.user.role
  );

  res.json({
    message: 'Orden cancelada correctamente',
    order
  });
});
module.exports = { create, mine, listAll, getOne, cancel };
