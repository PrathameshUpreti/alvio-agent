export default function componentStyleOverrides(theme) {
    const bgColor = theme.colors?.grey50
    // Fallbacks for palette/colors
    const primaryColor = theme.palette?.primary?.main || theme.colors?.primaryMain || '#1976d2'
    const textPrimary = theme.palette?.text?.primary || theme.colors?.textDark || '#222'
    const textSecondary = theme.palette?.text?.secondary || theme.colors?.grey500 || '#888'
    // Unified background for all
    const unifiedBg = 'transparent'
    return {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: 'thin',
                    scrollbarColor: theme?.customization?.isDarkMode
                        ? `${theme.colors?.grey500} ${theme.colors?.darkPrimaryMain}`
                        : `${theme.colors?.grey300} ${theme.paper}`,
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        width: 8,
                        height: 8,
                        backgroundColor: theme?.customization?.isDarkMode ? theme.colors?.darkPrimaryMain : theme.paper
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        borderRadius: 8,
                        backgroundColor: theme?.customization?.isDarkMode ? theme.colors?.grey500 : theme.colors?.grey300,
                        minHeight: 24,
                        border: `2px solid ${theme?.customization?.isDarkMode ? theme.colors?.darkPrimaryMain : theme.paper}`
                    },
                    '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
                        backgroundColor: theme?.customization?.isDarkMode ? theme.colors?.darkPrimary200 : theme.colors?.grey500
                    },
                    '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
                        backgroundColor: theme?.customization?.isDarkMode ? theme.colors?.darkPrimary200 : theme.colors?.grey500
                    },
                    '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: theme?.customization?.isDarkMode ? theme.colors?.darkPrimary200 : theme.colors?.grey500
                    },
                    '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
                        backgroundColor: theme?.customization?.isDarkMode ? theme.colors?.darkPrimaryMain : theme.paper
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: '8px',
                    boxShadow: 'none',
                    padding: '8px 16px',
                    textTransform: 'none',
                    '&:hover': {
                        boxShadow: theme?.customization?.isDarkMode
                            ? '0 4px 14px 0 rgba(0, 85, 255, 0.4)'
                            : '0 4px 14px 0 rgba(0, 85, 255, 0.3)'
                    },
                    '&.MuiButton-contained': {
                        '&:hover': {
                            backgroundColor: theme.colors?.primaryDark
                        }
                    }
                }
            }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit',
                    background: 'transparent'
                }
            }
        },
        MuiPaper: {
            defaultProps: {
                elevation: theme?.customization?.isDarkMode ? 1 : 0
            },
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    transition: 'all 0.2s ease-in-out'
                },
                rounded: {
                    borderRadius: '12px'
                },
                elevation1: {
                    boxShadow: theme?.customization?.isDarkMode ? '0 2px 14px 0 rgba(0, 0, 0, 0.3)' : '0 2px 14px 0 rgba(0, 0, 0, 0.05)'
                }
            }
        },
        MuiCardHeader: {
            styleOverrides: {
                root: {
                    color: theme.colors?.textDark,
                    padding: '24px'
                },
                title: {
                    fontSize: '1.125rem',
                    fontWeight: 600
                }
            }
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '24px'
                }
            }
        },
        MuiCardActions: {
            styleOverrides: {
                root: {
                    padding: '24px'
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    color: theme.darkTextPrimary,
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    borderRadius: '8px',
                    marginBottom: '4px',
                    '&.Mui-selected': {
                        color: theme.menuSelected,
                        backgroundColor: theme.menuSelectedBack,
                        '&:hover': {
                            backgroundColor: theme.menuSelectedBack
                        },
                        '& .MuiListItemIcon-root': {
                            color: theme.menuSelected
                        }
                    },
                    '&:hover': {
                        backgroundColor: theme.menuSelectedBack,
                        color: theme.menuSelected,
                        '& .MuiListItemIcon-root': {
                            color: theme.menuSelected
                        }
                    }
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: theme.darkTextPrimary,
                    minWidth: '36px'
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: theme.textDark,
                    fontWeight: 500
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: theme.textDark,
                    fontWeight: 500,
                    '&::placeholder': {
                        color: theme.darkTextSecondary,
                        fontSize: '0.875rem'
                    },
                    '&.Mui-disabled': {
                        WebkitTextFillColor: theme?.customization?.isDarkMode ? theme.colors?.grey500 : theme.darkTextSecondary
                    }
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    background: theme?.customization?.isDarkMode ? '#232627' : '#fff',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme?.customization?.isDarkMode ? '#888' : '#888',
                        borderWidth: '1.5px'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: primaryColor
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: primaryColor,
                        borderWidth: '2px'
                    },
                    '&.MuiInputBase-multiline': {
                        padding: 1
                    }
                },
                input: {
                    fontWeight: 500,
                    background: theme?.customization?.isDarkMode ? '#232627' : '#fff',
                    color: textPrimary,
                    padding: '15.5px 14px',
                    borderRadius: '8px',
                    '&.MuiInputBase-inputSizeSmall': {
                        padding: '10px 14px',
                        '&.MuiInputBase-inputAdornedStart': {
                            paddingLeft: 0
                        }
                    },
                    '&::placeholder': {
                        color: textSecondary,
                        opacity: 1
                    },
                    '&.Mui-disabled': {
                        WebkitTextFillColor: theme?.customization?.isDarkMode ? '#aaa' : '#888',
                        opacity: 1
                    }
                },
                inputAdornedStart: {
                    paddingLeft: 4
                },
                notchedOutline: {
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out'
                }
            }
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    '&.Mui-disabled': {
                        color: theme.colors?.grey300
                    }
                },
                track: {
                    height: 6,
                    borderRadius: 3
                },
                rail: {
                    height: 6,
                    borderRadius: 3
                },
                mark: {
                    backgroundColor: theme.paper,
                    width: '4px'
                },
                thumb: {
                    width: 18,
                    height: 18
                },
                valueLabel: {
                    color: theme.colors?.primaryLight
                }
            }
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: theme.divider,
                    opacity: theme?.customization?.isDarkMode ? 0.15 : 0.25
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    color: theme.colors?.primaryDark,
                    background: theme.colors?.primary200
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    '&.MuiChip-deletable .MuiChip-deleteIcon': {
                        color: 'inherit'
                    }
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    color: theme?.customization?.isDarkMode ? theme.colors?.paper : theme.paper,
                    background: theme.colors?.grey700,
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    fontWeight: 500
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                option: {
                    padding: '12px 16px',
                    '&:hover': {
                        background: theme?.customization?.isDarkMode ? '#233345 !important' : ''
                    }
                },
                paper: {
                    borderRadius: '8px'
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '12px 16px',
                    borderColor: theme.divider
                },
                head: {
                    fontWeight: 600,
                    color: theme.darkTextPrimary
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    textTransform: 'none',
                    minWidth: 'auto'
                }
            }
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    height: '3px',
                    borderRadius: '1.5px'
                }
            }
        }
    }
}
