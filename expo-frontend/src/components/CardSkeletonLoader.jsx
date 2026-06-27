import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { woltTheme } from '../styles/woltTheme';

const CardSkeletonLoader = () => {
    // Create an animated value for opacity, starting at 0.3
    const opacityAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        // Create a looping animation that fades in and out smoothly
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 0.7, // Fade in to 70% opacity
                    duration: 800,
                    useNativeDriver: true, // Use hardware acceleration for smooth 60fps animation
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.3, // Fade back out to 30% opacity
                    duration: 800,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [opacityAnim]);

    return (
        <View style={styles.card}>
            {/* Image Placeholder */}
            <Animated.View style={[styles.imageShimmer, { opacity: opacityAnim }]} />
            
            {/* Content Placeholder */}
            <View style={styles.contentContainer}>
                {/* Title Line */}
                <Animated.View style={[styles.shimmerLine, { opacity: opacityAnim, height: 24, width: '70%', marginBottom: 8 }]} />
                
                {/* Subtitle Line (Cuisine) */}
                <Animated.View style={[styles.shimmerLine, { opacity: opacityAnim, height: 16, width: '40%', marginBottom: 16 }]} />
                
                <View style={styles.footer}>
                    {/* Rating Pill */}
                    <Animated.View style={[styles.shimmerLine, { opacity: opacityAnim, height: 24, width: 50, borderRadius: 12 }]} />
                    {/* Delivery Time / Distance */}
                    <Animated.View style={[styles.shimmerLine, { opacity: opacityAnim, height: 16, width: 60 }]} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        ...woltTheme.components.card,
        height: '100%',
        flexDirection: 'column',
        overflow: 'hidden', // Ensures the image shimmer doesn't bleed out of rounded corners
    },
    imageShimmer: {
        backgroundColor: '#e2e8f0',
        height: 160,
        width: '100%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    contentContainer: {
        padding: 12,
        flexGrow: 1,
        flexDirection: 'column',
    },
    shimmerLine: {
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

export default CardSkeletonLoader;
