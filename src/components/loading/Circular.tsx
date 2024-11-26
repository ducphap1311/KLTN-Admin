import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export const Circular = () => {
    return (
        <Box className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <CircularProgress />
        </Box>
    );
};
