import React, { MouseEvent, Dispatch, SetStateAction, FunctionComponent } from 'react';
import { styled } from '@mui/system';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Box, Card, Grid, ToggleButton, Typography } from '@mui/material';

const ImageToggleButton = styled(ToggleButton)({
    '&.Mui-selected': {
        border: '5px solid rgba(0, 134, 248, 0.7)',
    },
});

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 3000, min: 1440 },
        items: 4,
    },
    desktop: {
        breakpoint: { max: 1440, min: 1100 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 1100, min: 600 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 600, min: 0 },
        items: 1,
    },
};
const layouts = [1, 2, 3, 4, 5, 6, 7];

interface Props {
    value: number;
    setValue: Dispatch<SetStateAction<number>>;
}

const LayoutSelect: FunctionComponent<Props> = ({ value, setValue }) => {
    const handleLayout = (event: MouseEvent<HTMLElement>, newLayout: number) => {
        if (newLayout === null) {
            return;
        }
        setValue(newLayout);
    };
    return (
        <Grid container alignSelf="center" alignItems="center">
            <Grid item xs={12}>
                <Typography variant="subtitle1">Tema:</Typography>
            </Grid>
            <Grid item alignSelf="center" margin="auto" xs={12} md={9}>
                <Carousel responsive={responsive} infinite={true} shouldResetAutoplay={false}>
                    {layouts.map((layout, i) => {
                        return (
                            <Box
                                sx={{
                                    width: { sx: 180, sm: 250 },
                                    height: 145,
                                }}
                                key={i}
                            >
                                <ImageToggleButton
                                    selected={value === layout}
                                    value={layout}
                                    color="primary"
                                    size="small"
                                    sx={{
                                        padding: 0,
                                    }}
                                    onChange={(event, value) => {
                                        handleLayout(event, value);
                                    }}
                                >
                                    <Card
                                        sx={
                                            value === layout
                                                ? {
                                                      width: 250,
                                                      height: 125,
                                                  }
                                                : {
                                                      width: 250,
                                                      height: 125,
                                                      borderRadius: 0,
                                                  }
                                        }
                                        elevation={5}
                                    >
                                        <img
                                            src={`/storage/layout/layout${layout}.png`}
                                            alt={`Layout ${layout}`}
                                            width="100%"
                                            height="100%"
                                        />
                                    </Card>
                                </ImageToggleButton>
                            </Box>
                        );
                    })}
                </Carousel>
            </Grid>
        </Grid>
    );
};

export default React.memo(LayoutSelect);
