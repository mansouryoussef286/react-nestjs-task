import * as React from 'react';
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	IconButton,
	Button,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import { UserServiceContext } from '../../context/userService.provider';

const navItems = [
	{ name: 'landing', path: '/' },
	{ name: 'Home', path: '/home' },
];

const drawerWidth = 240;

export default function ResponsiveAppBar() {
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const { user, onSignout } = React.useContext(UserServiceContext)!;

	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};

	// 1. Mobile Drawer Content
	const drawer = (
		<Box onClick={handleDrawerToggle} sx={{ backgroundColor: 'var(--bg-primary-color)', color: 'var(--text-color-primary)', height: '100%' }}>
			<Typography variant="h6" sx={{ my: 2, color: 'var(--color-primary)' }}>
				Easy Gen Task
			</Typography>
			<List>
				{navItems.map((item) => (
					<ListItem key={item.name} disablePadding>
						<ListItemButton
							component={RouterLink}
							to={item.path}
							sx={{ textAlign: 'center' }}
						>
							<ListItemText primary={item.name} />
						</ListItemButton>
					</ListItem>
				))}
				{user ? <ListItem disablePadding>
					<ListItemButton
						component={RouterLink}
						to="/signin"
						sx={{ textAlign: 'center' }} >

						<ListItemText primary="Sign Out" />
					</ListItemButton>
				</ListItem>
					:
					<ListItem disablePadding>
						<ListItemButton
							component={RouterLink}
							to="/signin"
							sx={{ textAlign: 'center' }} >
							<ListItemText primary="Sign In" />
						</ListItemButton>
					</ListItem>}

			</List>
		</Box>
	);

	return (

		<>
			<AppBar position='relative' component="nav" sx={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-accent)' }}>
				<Toolbar>
					{/* 🔑 1. Mobile Menu Button (Visible on small screens, hidden on medium and up) */}
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						<MenuIcon />
					</IconButton>

					{/* Logo/Title (Visible on all screens) */}
					<Typography
						variant="h6"
						sx={{
							flexGrow: 1,
							display: 'block',
							textDecoration: 'none',
							color: 'inherit'
						}}
					>
						Easy Gen Task
					</Typography>

					{/* 🔑 2. Desktop Navigation Links (Hidden on small screens, visible on medium and up) */}
					<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
						{navItems.map((item) => (
							<Button key={item.name} sx={{ color: '#fff' }} component={RouterLink} to={item.path}>
								{item.name}
							</Button>
						))}
						{user ?
							<Button sx={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-secondary)' }} variant="contained" component={RouterLink} to="/signin" onClick={() => onSignout()}>
								Sign Out
							</Button>
							:
							<Button sx={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-secondary)' }} variant="contained" component={RouterLink} to="/signin">
								Sign In
							</Button>
						}

					</Box>
				</Toolbar>
			</AppBar>

			{/* 🔑 3. Mobile Drawer Component */}
			<Drawer
				// The container is used to set the initial width
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{ keepMounted: true }} // Better open performance on mobile.
				sx={{
					display: { xs: 'block', sm: 'none' }, // Only show Drawer on small screens
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					backgroundColor: 'var(--bg-primary-color'
				}}
			>
				{drawer}
			</Drawer>
			{/* This Box is just to push content down below the fixed AppBar */}
		</>
	);
}