import React, { useState, useEffect } from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import AppleHealthKit from 'react-native-health';
import GoogleFit, { Scopes } from 'react-native-google-fit';

const UserActivityScreen = () => {
  const [platform, setPlatform] = useState('');
  const [activityData, setActivityData] = useState(null);

  useEffect(() => {
    // Check which platform the user is on
    const currentPlatform = Platform.OS;
    setPlatform(currentPlatform);

    if (currentPlatform === 'ios') {
      // Request permissions for Apple HealthKit (iOS)
      const permissions = [
        AppleHealthKit.Constants.Permissions.StepCount,
        AppleHealthKit.Constants.Permissions.HeartRate,
      ];

      AppleHealthKit.initHealthKit({ permissions }, (err) => {
        if (err) {
          console.error('Error initializing Apple HealthKit:', err);
          return;
        }
        fetchActivityDataFromAppleHealth();
      });
    } else if (currentPlatform === 'android') {
      // Request permissions for Google Fit (Android)
      GoogleFit.authorize({ scopes: [Scopes.FITNESS_ACTIVITY_READ] })
        .then(() => {
          fetchActivityDataFromGoogleFit();
        })
        .catch((err) => console.error('Error authorizing Google Fit:', err));
    }
  }, []);

  const fetchActivityDataFromAppleHealth = () => {
    const options = { startDate: new Date(2023, 0, 1).toISOString() }; // Fetch from start of the year

    // Fetch Steps
    AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
      if (err) {
        console.error('Error fetching steps:', err);
        return;
      }
      const totalSteps = results.reduce((acc, curr) => acc + curr.value, 0);
      setActivityData({
        steps: totalSteps,
        heartRate: 'Not available', // Heart rate will be fetched similarly
      });
    });

    // Fetch Heart Rate
    AppleHealthKit.getHeartRateSamples(options, (err, results) => {
      if (err) {
        console.error('Error fetching heart rate:', err);
        return;
      }
      const averageHeartRate = results.reduce((acc, curr) => acc + curr.value, 0) / results.length;
      setActivityData((prevData) => ({
        ...prevData,
        heartRate: averageHeartRate.toFixed(2),
      }));
    });
  };

  const fetchActivityDataFromGoogleFit = () => {
    const options = { startDate: new Date(2023, 0, 1).toISOString() };

    // Fetch Steps from Google Fit
    GoogleFit.getDailyStepCountSamples(options)
      .then((res) => {
        const totalSteps = res.reduce((acc, curr) => acc + curr.steps, 0);
        setActivityData({
          steps: totalSteps,
          heartRate: 'Not available', // Heart rate can be fetched similarly using Google Fit API
        });
      })
      .catch((err) => {
        console.error('Error fetching Google Fit data:', err);
      });
  };

  const renderActivityData = () => {
    if (activityData) {
      return (
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>Steps: {activityData.steps}</Text>
          <Text style={styles.activityText}>Heart Rate: {activityData.heartRate} bpm</Text>
        </View>
      );
    }
    return <Text>Loading activity data...</Text>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Activity</Text>
      {platform === 'ios' && <Text style={styles.platformText}>You are using iOS</Text>}
      {platform === 'android' && <Text style={styles.platformText}>You are using Android</Text>}
      {renderActivityData()}
      <Button title="Refresh" onPress={() => setActivityData(null)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  platformText: {
    fontSize: 18,
    marginBottom: 10,
  },
  activityContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  activityText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default UserActivityScreen;
