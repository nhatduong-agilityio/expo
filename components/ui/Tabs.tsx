import { memo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { StyleSheet, UnistylesVariants } from 'react-native-unistyles';
import { Text } from './Text';

type TabsVariants = UnistylesVariants<typeof styles>;

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: TabsVariants['variant'];
}

export const Tabs = memo(
  ({ tabs, activeTab, onTabChange, variant }: TabsProps) => {
    styles.useVariants({
      variant,
    });

    return (
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {tabs.map(tab => {
            const isActive = tab.id === activeTab;

            styles.useVariants({
              variant,
              active: isActive || undefined,
            });

            return (
              <Pressable
                key={tab.id}
                style={({ pressed }) => [
                  styles.tabButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => onTabChange(tab.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={tab.label}
                accessibilityHint={`Switch to the ${tab.label} tab`}
              >
                <Text variant="body" style={styles.tabText}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  },
);

Tabs.displayName = 'Tabs';

const styles = StyleSheet.create(theme => ({
  container: {
    backgroundColor: 'transparent',
    variants: {
      variant: {
        default: {
          alignItems: 'flex-start',
        },
        secondary: {
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  tabButton: {
    paddingBottom: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  tabText: {
    variants: {
      variant: {
        default: {
          color: theme.colors.tabInactive,
        },
        primary: {
          color: theme.colors.tabInactive,
        },
        secondary: {
          color: theme.colors.tabInactive,
        },
      },
      active: {
        true: {
          color: theme.colors.tabActive,
        },
      },
    },
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    variants: {
      variant: {
        default: {
          backgroundColor: theme.colors.primary,
        },
        primary: {
          backgroundColor: theme.colors.primary,
        },
        secondary: {
          backgroundColor: theme.colors.primary,
        },
      },
    },
  },
}));
