import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/Supabase';
import {StyleSheet, View, Alert, Image, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import Home from "./Home";


