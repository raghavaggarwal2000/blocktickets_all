import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import blockTicketsLogo from "../../images/blockticketlogo.png";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "../../images/searchIcon.svg";
import Drawer from "@mui/material/Drawer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router";
import { LogoutUser } from "../../api/api-client";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import userImg from "../../images/defaltUser.webp";

const Navbar = ({ isLogin, isAdmin }) => {
  const [toggleMenu, setToggleMenu] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [currentMenu, setCurrentMenu] = useState("all");
  const [searchKey, setSearchKey] = useState("");
  const [showNavLeft, setShowNavLeft] = useState(false);
  const [display, setDisplay] = useState(false);
  const [tokenSession, setTokenSession] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // Search Events
  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.target.id === "searchLogo" ||
      event.key === "13"
    ) {
      navigate(`/search/${searchKey}`);
    }
  };
  const handleSearchChange = (event) => {
    setSearchKey(event.target.value);
  };

  const [anchorEl1, setAnchorEl1] = useState(null);

  const [anchorEl2, setAnchorEl2] = useState(null);
  const open2 = Boolean(anchorEl2);

  const [anchorEl3, setAnchorEl3] = useState(null);
  const open3 = Boolean(anchorEl3);
  const handleOpen3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };
  const handleClose3 = () => {
    setAnchorEl3(null);
  };

  const [drawer, setDrawer] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawer({ ...drawer, [anchor]: open });
    setCurrentMenu("all");
  };

  const logout = async () => {
    const res = await LogoutUser(isLogin);
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const navigate = useNavigate();
  let searchRef = useRef();
  let navExploreRef = useRef();
  useEffect(() => {
    let handler = (event) => {
      if (
        searchRef &&
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        screenWidth < 992
      ) {
        setDisplay(false);
      }
      if (
        navExploreRef &&
        navExploreRef.current &&
        !navExploreRef.current.contains(event.target)
      ) {
        setShowNavLeft(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  useEffect(() => {
    setUserInfo(JSON.parse(sessionStorage.getItem("user-data")));
  }, [isLogin]);
  return (
    <nav className="flex justify-between items-center h-[72px] py-4 w-full bg-black">
      <div className="responsiveMargin md:mx-2 lg:mx-[6rem] xl:[18rem] doubleXl:mx-[18rem] flex justify-between items-center w-full">
        <div className="flex overflow-hidden items-center w-fit">
          <img
            src={blockTicketsLogo}
            alt="block-tickets"
            className="!w-[7rem] h-full cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="screen7:hidden max-w-[500px] w-full">
          <Search
            onKeyDown={handleKeyDown}
            id="searchKey"
            value={searchKey}
            onChange={handleSearchChange}
          >
            <SearchIconWrapper>
              <img src={SearchIcon} alt="search" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search blocktickets"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </div>

        {isLogin ? (
          <div
            className="flex items-center cursor-pointer min-w-fit ml-8"
            onClick={handleOpen3}
          >
            <img
              className="avatar--image object-cover"
              src={
                JSON.parse(sessionStorage.getItem("user-data"))?.profilePic
                  ? JSON.parse(sessionStorage.getItem("user-data")).profilePic
                  : userImg
              }
              alt="profile"
            />
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="min-w-fit ml-8 text-[#fff]"
          >
            <AccountCircleOutlinedIcon fontSize="large" />
          </button>
        )}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl3}
          open={open3}
          onClose={handleClose3}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          PaperProps={{
            style: {
              marginTop: "1rem",
            },
          }}
        >


           <Link className="font-semibold text-silver" to="/dashboard/v2">
            <MenuItem onClick={handleClose3}>
              My Profile
            </MenuItem>
          </Link>
          
          {/*
          <Link className="font-semibold text-silver" to="/dashboard/v2">
            <MenuItem onClick={handleClose3}>
              My Tickets
            </MenuItem>  
          </Link> */}

          <Link className="font-semibold text-silver" to="/edit-profile">
            <MenuItem onClick={handleClose3}>
              Account settings
            </MenuItem>
          </Link>
          {userInfo && (userInfo?.role === 1 || userInfo?.role === 2) && (
            <Link
                className="font-semibold text-silver"
                to="/create/event/form"
            >
             <MenuItem onClick={handleClose3}>
                Create Event
              </MenuItem>
            </Link>
          )}

          <div className="font-semibold text-silver" onClick={logout}>
            <MenuItem onClick={handleClose3}>
              Logout
            </MenuItem>
          </div>
        </Menu>
        {/* <button
                    onClick={toggleDrawer("right", true)}
                    className="hidden text-[#fff] screen6:block"
                >
                     
                    <MenuIcon fontSize="large" />
                </button> */}
        <Drawer
          anchor={"right"}
          open={drawer["right"]}
          onClose={toggleDrawer("right", false)}
          PaperProps={{
            style: { padding: "2rem", width: "300px" },
            className: ["overflow-hidden"],
          }}
        >
          <Search className="mb-4 screen6:hidden screen7:block">
            <SearchIconWrapper>
              <img src={SearchIcon} alt="search" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search blocktickets"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          {currentMenu === "all" && (
            <>
              <button
                onClick={() => setCurrentMenu("explore")}
                className="py-3 font-semibold text-lg flex justify-between items-center"
              >
                Explore <ChevronRightIcon />
              </button>
              <button
                onClick={() => setCurrentMenu("resources")}
                className="py-3 font-semibold text-lg flex justify-between items-center"
              >
                Resources <ChevronRightIcon />
              </button>
              <button
                onClick={() => setCurrentMenu("marketplace")}
                className="py-3 font-semibold text-lg flex justify-between items-center"
              >
                Marketplace <ChevronRightIcon />
              </button>
            </>
          )}
        </Drawer>
      </div>
    </nav>
  );
};

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: alpha("#fff", 1),
  "&:hover": {
    backgroundColor: alpha("#fff", 1),
  },
  border: "2px solid #ffff",
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 0, 1, 0),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create("width"),
    width: "100%",
    textAlign: "center",
  },
}));

export default Navbar;
