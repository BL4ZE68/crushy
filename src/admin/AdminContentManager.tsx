import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CrushyButton } from '../components/CrushyButton';
import {
  AdminField,
  AdminGame,
  AdminItem,
  AdminOptions,
  deleteAdminItem,
  fetchAdminItems,
  fetchAdminOptions,
  getAdminFields,
  getAdminFormValues,
  getItemSubtitle,
  getItemTitle,
  saveAdminItem,
} from './adminApi';
import { AdminFormValues, AdminSection, validateAdminForm } from './validation';
import { designTokens } from '../theme/theme';
import { useCrushyTheme } from '../theme/useCrushyTheme';

type Props = { section: AdminSection };
type PickerState = { field: string; date: Date } | null;

const emptyOptions: AdminOptions = { categories: [], games: [] };

export function AdminContentManager({ section }: Props) {
  const { palette } = useCrushyTheme();
  const [items, setItems] = useState<AdminItem[]>([]);
  const [options, setOptions] = useState<AdminOptions>(emptyOptions);
  const [values, setValues] = useState<AdminFormValues>(() => getAdminFormValues(section));
  const [editingId, setEditingId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [formError, setFormError] = useState('');
  const [picker, setPicker] = useState<PickerState>(null);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  const fields = useMemo(() => getAdminFields(section), [section]);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [nextItems, nextOptions] = await Promise.all([
        fetchAdminItems(section),
        fetchAdminOptions(),
      ]);
      setItems(nextItems);
      setOptions(nextOptions);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Impossible de charger le contenu.');
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => {
    setValues(getAdminFormValues(section));
    setEditingId(undefined);
    void reload();
  }, [reload, section]);

  function updateValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setFormError('');
  }

  async function submit() {
    const result = validateAdminForm(section, values);
    if ('error' in result) {
      setFormError(result.error);
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      await saveAdminItem(section, result.data, editingId);
      setValues(getAdminFormValues(section));
      setEditingId(undefined);
      await reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(item: AdminItem) {
    Alert.alert(
      'Supprimer ce contenu ?',
      'Cette action est définitive.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            void deleteAdminItem(section, item.id)
              .then(reload)
              .catch((error: unknown) => {
                setLoadError(error instanceof Error ? error.message : 'Suppression impossible.');
              });
          },
        },
      ],
    );
  }

  function beginEdit(item: AdminItem) {
    setEditingId(item.id);
    setValues(getAdminFormValues(section, item));
    setFormError('');
  }

  function optionItems(field: AdminField) {
    if (field.options) return field.options;
    if (field.optionSource === 'games') {
      return options.games.map((game: AdminGame) => ({ label: game.title, value: game.id }));
    }
    if (field.optionSource === 'categories') {
      return options.categories
        .filter((category) => category.kind === field.categoryKind)
        .map((category) => ({ label: category.name, value: category.id }));
    }
    return [];
  }

  function openPicker(field: AdminField) {
    const currentValue = values[field.name];
    const parsedDate = currentValue ? new Date(currentValue) : new Date(Date.now() + 60 * 60 * 1000);
    setPicker({ field: field.name, date: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate });
    setPickerMode('date');
  }

  function updatePicker(event: DateTimePickerEvent, pickedDate?: Date) {
    if (event.type !== 'set' || !pickedDate || !picker) return;
    const next = new Date(picker.date);
    if (pickerMode === 'date') {
      next.setFullYear(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate());
    } else {
      next.setHours(pickedDate.getHours(), pickedDate.getMinutes(), 0, 0);
    }
    setPicker({ ...picker, date: next });
  }

  function renderField(field: AdminField) {
    const value = values[field.name] ?? '';

    if (field.type === 'select') {
      const choices = optionItems(field);
      const allowsEmpty = field.optionSource === 'categories' || field.options?.some((option) => option.value === '');
      return (
        <View key={field.name} style={styles.field}>
          <Text style={[styles.label, { color: palette.text }]}>{field.label}</Text>
          <View style={styles.options}>
            {allowsEmpty ? (
              <OptionChip
                label={field.optionSource === 'categories' ? 'Aucune' : 'Toutes'}
                onPress={() => updateValue(field.name, '')}
                selected={!value}
              />
            ) : null}
            {choices.map((choice) => (
              <OptionChip
                key={choice.value}
                label={choice.label}
                onPress={() => updateValue(field.name, choice.value)}
                selected={value === choice.value}
              />
            ))}
          </View>
        </View>
      );
    }

    if (field.type === 'datetime') {
      return (
        <View key={field.name} style={styles.field}>
          <Text style={[styles.label, { color: palette.text }]}>{field.label}</Text>
          <View style={styles.options}>
            <OptionChip
              label={value ? formatDate(value) : 'Choisir'}
              onPress={() => openPicker(field)}
              selected={Boolean(value)}
            />
            {value ? <OptionChip label="Effacer" onPress={() => updateValue(field.name, '')} selected={false} /> : null}
          </View>
        </View>
      );
    }

    return (
      <View key={field.name} style={styles.field}>
        <Text style={[styles.label, { color: palette.text }]}>{field.label}</Text>
        <TextInput
          autoCapitalize={field.name === 'platform_url' ? 'none' : 'sentences'}
          autoCorrect={field.name !== 'platform_url'}
          keyboardType={field.name.endsWith('_xp') ? 'number-pad' : field.name === 'platform_url' ? 'url' : 'default'}
          multiline={field.multiline}
          onChangeText={(text) => updateValue(field.name, text)}
          placeholder={field.placeholder}
          placeholderTextColor={palette.subtle}
          style={[
            styles.input,
            field.multiline && styles.multiline,
            { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text },
          ]}
          value={value}
        />
      </View>
    );
  }

  return (
    <View>
      <View style={[styles.form, { backgroundColor: palette.surfaceAlt }]}>
        <Text style={[styles.formTitle, { color: palette.text }]}>
          {editingId ? 'Modifier le contenu' : 'Ajouter du contenu'}
        </Text>
        {fields.map(renderField)}
        {formError ? <Text accessibilityRole="alert" style={[styles.error, { color: palette.accent }]}>{formError}</Text> : null}
        <CrushyButton disabled={saving} onPress={() => void submit()}>
          {saving ? 'Enregistrement…' : editingId ? 'Enregistrer les modifications' : 'Ajouter'}
        </CrushyButton>
        {editingId ? (
          <CrushyButton
            secondary
            disabled={saving}
            onPress={() => {
              setEditingId(undefined);
              setValues(getAdminFormValues(section));
              setFormError('');
            }}
          >
            Annuler la modification
          </CrushyButton>
        ) : null}
      </View>

      <Text style={[styles.listTitle, { color: palette.text }]}>Contenus existants</Text>
      {loadError ? <Text accessibilityRole="alert" style={[styles.error, { color: palette.accent }]}>{loadError}</Text> : null}
      {loading ? <Text style={[styles.empty, { color: palette.subtle }]}>Chargement des contenus…</Text> : null}
      {!loading && items.length === 0 ? <Text style={[styles.empty, { color: palette.subtle }]}>Aucun contenu pour l’instant.</Text> : null}
      {items.map((item) => {
        const published = item.is_published === true || item.is_active === true;
        const subtitle = getItemSubtitle(item);
        return (
          <View key={item.id} style={[styles.item, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <Text numberOfLines={2} style={[styles.itemTitle, { color: palette.text }]}>{getItemTitle(item)}</Text>
            {subtitle ? <Text numberOfLines={2} style={[styles.itemSubtitle, { color: palette.subtle }]}>{subtitle}</Text> : null}
            <Text style={[styles.status, { color: published ? palette.accent : palette.subtle }]}>
              {published ? 'Publié / actif' : 'Brouillon / inactif'}
            </Text>
            <View style={styles.itemActions}>
              <ActionButton label="Modifier" onPress={() => beginEdit(item)} />
              <ActionButton destructive label="Supprimer" onPress={() => confirmDelete(item)} />
            </View>
          </View>
        );
      })}

      <Modal animationType="fade" onRequestClose={() => setPicker(null)} transparent visible={Boolean(picker)}>
        <View style={[styles.overlay, { backgroundColor: palette.overlay }]}>
          {picker ? (
            <View style={[styles.pickerCard, { backgroundColor: palette.surface }]}>
              <Text style={[styles.formTitle, { color: palette.text }]}>Programmer la publication</Text>
              <View style={styles.options}>
                {(['date', 'time'] as const).map((mode) => (
                  <OptionChip
                    key={mode}
                    label={mode === 'date' ? 'Date' : 'Heure'}
                    onPress={() => setPickerMode(mode)}
                    selected={pickerMode === mode}
                  />
                ))}
              </View>
              <DateTimePicker
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                mode={pickerMode}
                onChange={updatePicker}
                value={picker.date}
              />
              <Text style={[styles.pickerSummary, { color: palette.subtle }]}>{formatDate(picker.date)}</Text>
              <CrushyButton
                onPress={() => {
                  updateValue(picker.field, picker.date.toISOString());
                  setPicker(null);
                }}
              >
                Confirmer la date
              </CrushyButton>
              <CrushyButton secondary onPress={() => setPicker(null)}>Annuler</CrushyButton>
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

function OptionChip({ label, onPress, selected }: { label: string; onPress: () => void; selected: boolean }) {
  const { palette } = useCrushyTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.option,
        { backgroundColor: selected ? palette.pink : palette.surface, borderColor: palette.border },
      ]}
    >
      <Text style={[styles.optionText, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

function ActionButton({ label, onPress, destructive = false }: { label: string; onPress: () => void; destructive?: boolean }) {
  const { palette } = useCrushyTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.actionButton}>
      <Text style={[styles.actionText, { color: destructive ? palette.accent : palette.text }]}>{label}</Text>
    </Pressable>
  );
}

function formatDate(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime())
    ? 'Date invalide'
    : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

const styles = StyleSheet.create({
  form: { borderRadius: designTokens.radius.lg, padding: 16, marginTop: 16 },
  formTitle: { fontSize: 18, fontFamily: designTokens.typography.bold, marginBottom: 8 },
  field: { marginTop: 12 },
  label: { fontSize: 13, fontFamily: designTokens.typography.bold, marginBottom: 7 },
  input: { borderWidth: 1, minHeight: 48, borderRadius: designTokens.radius.md, paddingHorizontal: 13, paddingVertical: 11, fontSize: 14, fontFamily: designTokens.typography.regular },
  multiline: { minHeight: 88, textAlignVertical: 'top' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  option: { minHeight: 38, justifyContent: 'center', borderWidth: 1, borderRadius: designTokens.radius.pill, paddingHorizontal: 13, paddingVertical: 7 },
  optionText: { fontSize: 12, fontFamily: designTokens.typography.bold },
  error: { fontSize: 13, lineHeight: 19, marginTop: 10 },
  listTitle: { fontSize: 18, fontFamily: designTokens.typography.bold, marginTop: 24, marginBottom: 10 },
  empty: { fontSize: 13, lineHeight: 19, marginBottom: 12 },
  item: { borderWidth: 1, borderRadius: designTokens.radius.md, padding: 13, marginBottom: 9 },
  itemTitle: { fontSize: 14, fontFamily: designTokens.typography.bold },
  itemSubtitle: { fontSize: 12, lineHeight: 17, marginTop: 4 },
  status: { fontSize: 11, fontFamily: designTokens.typography.bold, marginTop: 7 },
  itemActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 },
  actionButton: { minHeight: 38, justifyContent: 'center', paddingHorizontal: 9 },
  actionText: { fontSize: 12, fontFamily: designTokens.typography.bold },
  overlay: { flex: 1, justifyContent: 'center', padding: 22 },
  pickerCard: { borderRadius: designTokens.radius.xl, padding: 18 },
  pickerSummary: { textAlign: 'center', fontSize: 13, marginTop: 8 },
});
