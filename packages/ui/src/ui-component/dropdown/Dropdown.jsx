import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Popper, FormControl, TextField, Box, Typography } from '@mui/material'
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete'
import { useTheme, styled } from '@mui/material/styles'
import PropTypes from 'prop-types'

const StyledPopper = styled(Popper)(({ theme }) => ({
    boxShadow: '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)',
    borderRadius: '10px',
    background: theme.palette.background.paper,
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: 'border-box',
        background: theme.palette.background.paper,
        '& ul': {
            padding: 10,
            margin: 10
        }
    }
}))

const GlassyFormControl = styled(FormControl)(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(1),
    background: theme.palette.mode === 'dark' ? 'rgba(30,30,40,0.7)' : 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
    border: '1.5px solid #f357a8',
    '& .MuiInputBase-root': {
        color: theme.palette.mode === 'dark' ? 'white' : 'black'
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    }
}))

export const Dropdown = ({ name, value, loading, options, onSelect, disabled = false, freeSolo = false, disableClearable = false }) => {
    const customization = useSelector((state) => state.customization)
    const findMatchingOptions = (options = [], value) => options.find((option) => option.name === value)
    const getDefaultOptionValue = () => ''
    let [internalValue, setInternalValue] = useState(value ?? 'choose an option')
    const theme = useTheme()

    return (
        <GlassyFormControl size='small'>
            <Autocomplete
                id={name}
                disabled={disabled}
                freeSolo={freeSolo}
                disableClearable={disableClearable}
                size='small'
                loading={loading}
                options={options || []}
                value={findMatchingOptions(options, internalValue) || getDefaultOptionValue()}
                onChange={(e, selection) => {
                    const value = selection ? selection.name : ''
                    setInternalValue(value)
                    onSelect(value)
                }}
                PopperComponent={StyledPopper}
                renderInput={(params) => {
                    const matchingOption = findMatchingOptions(options, internalValue)
                    return (
                        <TextField
                            {...params}
                            value={internalValue}
                            label={name}
                            variant='outlined'
                            sx={{
                                height: '100%',
                                '& .MuiInputBase-root': {
                                    height: '100%',
                                    background: 'transparent',
                                    borderRadius: 12,
                                    '& fieldset': {
                                        borderColor: 'transparent'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#f357a8'
                                },
                                '& .Mui-focused .MuiInputLabel-root': {
                                    color: '#f357a8'
                                },
                                '& .MuiAutocomplete-endAdornment': {
                                    color: '#f357a8'
                                }
                            }}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: matchingOption?.imageSrc ? (
                                    <Box
                                        component='img'
                                        src={matchingOption.imageSrc}
                                        alt={matchingOption.label || 'Selected Option'}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%'
                                        }}
                                    />
                                ) : null
                            }}
                        />
                    )
                }}
                renderOption={(props, option) => (
                    <Box component='li' {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.imageSrc && (
                            <img
                                src={option.imageSrc}
                                alt={option.description}
                                style={{
                                    width: 30,
                                    height: 30,
                                    padding: 1,
                                    borderRadius: '50%'
                                }}
                            />
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='h5'>{option.label}</Typography>
                            {option.description && (
                                <Typography sx={{ color: customization.isDarkMode ? '#9e9e9e' : '' }}>{option.description}</Typography>
                            )}
                        </div>
                    </Box>
                )}
                sx={{ height: '100%' }}
            />
        </GlassyFormControl>
    )
}

Dropdown.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    loading: PropTypes.bool,
    options: PropTypes.array,
    freeSolo: PropTypes.bool,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
    disableClearable: PropTypes.bool
}
