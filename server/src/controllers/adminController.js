import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

const isScopedAdmin = (req) => req.user.role !== 'super_admin';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const { department, role, page = 1, limit = 20 } = req.query;

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.max(parseInt(limit, 10) || 20, 1);
    const query = {};

    if (isScopedAdmin(req)) {
      query.department = req.user.department;
    } else if (department) {
      query.department = department;
    }

    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .skip((parsedPage - 1) * parsedLimit)
      .exec();

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / parsedLimit),
      currentPage: parsedPage,
      total: count
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (isScopedAdmin(req) && user.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (isScopedAdmin(req) && user.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const allowedUpdates = ['firstName', 'lastName', 'email', 'department', 'role', 'isActive'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (isScopedAdmin(req) && field === 'department') {
          user[field] = req.user.department;
          return;
        }

        if (isScopedAdmin(req) && field === 'role' && req.body[field] === 'super_admin') {
          return;
        }

        user[field] = req.body[field];
      }
    });

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (isScopedAdmin(req) && user.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get audit logs
// @route   GET /api/audit-logs
// @access  Private/Admin
export const getAuditLogs = async (req, res) => {
  try {
    const { department, action, userId, page = 1, limit = 50 } = req.query;

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.max(parseInt(limit, 10) || 50, 1);
    const query = {};

    if (isScopedAdmin(req)) {
      query.department = req.user.department;
    } else if (department) {
      query.department = department;
    }

    if (action) query.action = action;
    if (userId) query.user = userId;

    const logs = await AuditLog.find(query)
      .populate('user', 'firstName lastName email department')
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .skip((parsedPage - 1) * parsedLimit)
      .exec();

    const count = await AuditLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(count / parsedLimit),
      currentPage: parsedPage,
      total: count
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
