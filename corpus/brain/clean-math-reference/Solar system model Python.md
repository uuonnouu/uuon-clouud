# Solar system model Python   
  
# Create a comparison table with both actual and altered distances in meters and miles  
  
# Convert actual distances to miles  
celestial_distances_miles = {key: value / 1609.34 for key, value in celestial_objects.items()}  
  
# Create a DataFrame for comparison  
comparison_df = pd.DataFrame({  
    "Celestial Object": celestial_objects.keys(),  
    "Actual Distance (Meters)": celestial_objects.values(),  
    "Altered Distance (Meters)": altered_distances.values(),  
    "Actual Distance (Miles)": celestial_distances_miles.values(),  
    "Altered Distance (Miles)": altered_distances_miles.values()  
})  
  
# Display the updated distances in a table  
tools.display_dataframe_to_user(name="Actual vs. Altered Celestial Distances", dataframe=comparison_df)  
